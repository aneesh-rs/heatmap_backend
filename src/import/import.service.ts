import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import csv from 'csv-parser';
import { Readable } from 'stream';

export interface NoiseDataPoint {
  lat: number;
  lng: number;
  noiseValue: number;
  timestamp: Date | string;
}

export interface ParseOptions {
  latField?: string;
  lngField?: string;
  noiseValueField?: string;
  timestampField?: string;
  dateFormat?: string;
}

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  /**
   * Parse CSV data and map to noise data format
   * @param buffer - CSV file buffer
   * @param options - Field mapping options
   * @returns Array of noise data points
   */
  async parseCsv(
    buffer: Buffer,
    options: ParseOptions = {},
  ): Promise<NoiseDataPoint[]> {
    const {
      latField = 'lat',
      lngField = 'lng',
      noiseValueField = 'noiseValue',
      timestampField = 'timestamp',
    } = options;

    return new Promise((resolve, reject) => {
      const results: NoiseDataPoint[] = [];
      const stream = Readable.from(buffer);

      stream
        .pipe(csv())
        .on('data', (row) => {
          try {
            const dataPoint = this.mapRowToNoiseData(row, {
              latField,
              lngField,
              noiseValueField,
              timestampField,
            });
            results.push(dataPoint);
          } catch (error) {
            this.logger.warn(
              `Skipping invalid row: ${JSON.stringify(row)} - ${error.message}`,
            );
          }
        })
        .on('end', () => {
          this.logger.log(`Parsed ${results.length} data points from CSV`);
          resolve(results);
        })
        .on('error', (error) => {
          this.logger.error(`Error parsing CSV: ${error.message}`, error.stack);
          reject(
            new BadRequestException(`Failed to parse CSV: ${error.message}`),
          );
        });
    });
  }

  /**
   * Parse JSON data and map to noise data format
   * @param buffer - JSON file buffer
   * @param options - Field mapping options
   * @returns Array of noise data points
   */
  async parseJson(
    buffer: Buffer,
    options: ParseOptions = {},
  ): Promise<NoiseDataPoint[]> {
    const {
      latField = 'lat',
      lngField = 'lng',
      noiseValueField = 'noiseValue',
      timestampField = 'timestamp',
    } = options;

    try {
      const jsonString = buffer.toString('utf-8');
      const data = JSON.parse(jsonString);

      // Handle both array and single object
      const dataArray = Array.isArray(data) ? data : [data];

      const results: NoiseDataPoint[] = dataArray.map((row, index) => {
        try {
          return this.mapRowToNoiseData(row, {
            latField,
            lngField,
            noiseValueField,
            timestampField,
          });
        } catch (error) {
          this.logger.warn(
            `Skipping invalid row at index ${index}: ${error.message}`,
          );
          throw error;
        }
      }).filter(Boolean); // Remove any undefined/null entries

      this.logger.log(`Parsed ${results.length} data points from JSON`);
      return results;
    } catch (error) {
      this.logger.error(`Error parsing JSON: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to parse JSON: ${error.message}`);
    }
  }

  /**
   * Map a data row to NoiseDataPoint format
   */
  private mapRowToNoiseData(
    row: any,
    options: {
      latField: string;
      lngField: string;
      noiseValueField: string;
      timestampField: string;
    },
  ): NoiseDataPoint {
    const { latField, lngField, noiseValueField, timestampField } = options;

    // Extract values (case-insensitive field matching)
    const lat = this.extractNumericValue(row, latField, 'latitude');
    const lng = this.extractNumericValue(row, lngField, 'longitude');
    const noiseValue = this.extractNumericValue(row, noiseValueField, 'noise');
    const timestamp = this.extractTimestamp(row, timestampField);

    if (lat === null || lng === null || noiseValue === null) {
      throw new Error(
        `Missing required fields: lat=${lat}, lng=${lng}, noiseValue=${noiseValue}`,
      );
    }

    return {
      lat,
      lng,
      noiseValue,
      timestamp,
    };
  }

  /**
   * Extract numeric value from row with case-insensitive field matching
   */
  private extractNumericValue(
    row: any,
    primaryField: string,
    alternativeFields: string | string[],
  ): number | null {
    const alternatives = Array.isArray(alternativeFields)
      ? alternativeFields
      : [alternativeFields];

    // Try primary field first (case-insensitive)
    const allFields = [primaryField, ...alternatives];
    for (const field of allFields) {
      const keys = Object.keys(row).filter(
        (key) => key.toLowerCase() === field.toLowerCase(),
      );
      if (keys.length > 0) {
        const value = row[keys[0]];
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue) && numValue !== null && numValue !== undefined) {
          return numValue;
        }
      }
    }

    return null;
  }

  /**
   * Extract timestamp from row
   */
  private extractTimestamp(row: any, timestampField: string): Date | string {
    const keys = Object.keys(row).filter(
      (key) => key.toLowerCase() === timestampField.toLowerCase(),
    );

    if (keys.length > 0) {
      const value = row[keys[0]];
      if (value) {
        // Try to parse as Date if it's a string
        if (typeof value === 'string') {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toISOString();
          }
        }
        // Return as-is if already a Date or valid timestamp
        return value;
      }
    }

    // Default to current timestamp if not found
    return new Date().toISOString();
  }
}

