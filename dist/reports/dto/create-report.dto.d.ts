declare class LocationDto {
    lat: number;
    lng: number;
    address: string;
}
export declare class CreateReportDto {
    feeling: string;
    category: string;
    reportText: string;
    firstName: string;
    lastName: string;
    location: LocationDto;
}
export {};
