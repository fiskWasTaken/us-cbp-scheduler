import axios, {AxiosInstance, AxiosPromise, AxiosResponse} from "axios";

export type Timestamp = string;
export type TimestampShort = string;

export enum LocationTypes {
    Land = "LND",
    Air = "AIR",
    Sea = "SEA"
}

export enum ServiceTypes {
    GlobalEntry = "Global Entry",
    NEXUS = "NEXUS",
    SENTRI = "SENTRI",
    USMexicoFAST = "U.S. / Mexico FAST",
    USCanadaFAST = "U.S. / Canada FAST"
}

export enum LocationFilterTypes {
    Before = "before",
    On = "on"
}

export enum SlotOrderBy {
    Soonest = "soonest"
}

export interface Service {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
    shortName: string;
    locationType: LocationTypes;
    locationCode: string;
    address: string;
    addressAdditional: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
    tzData: string;
    phoneNumber: string;
    phoneAreaCode: string;
    phoneCountryCode: string;
    phoneExtension: string;
    phoneAltNumber: string;
    phoneAltAreaCode: string;
    phoneAltCountryCode: string;
    phoneAltExtension: string;
    faxNumber: string;
    faxAreaCode: string;
    faxCountryCode: string;
    faxExtension: string;
    effectiveDate:  TimestampShort
    temporary: boolean;
    inviteOnly: boolean;
    operational: boolean;
    directions: string;
    mapFileName: string;
    accessCode: string;
    lastUpdatedBy: string;
    lastUpdatedDate: Timestamp;
    createdDate: Timestamp;
    remoteInd: boolean;
    services: Service[];
}

export interface SlotsAsLocationsRequest {
    minimum?: number; // idk what this is
    filterTimestampBy?: LocationFilterTypes;
    timestamp?: Timestamp;
    serviceName: ServiceTypes;
}

export interface SlotsRequest {
    minimum?: number;
    limit?: number;
    locationId: number;
    orderBy?: SlotOrderBy;
}

export interface Slot {
    active: boolean;
    duration: number;
    locationId: number;
    remoteInd: boolean; // idk what this is
    startTimestamp: TimestampShort;
    endTimestamp: TimestampShort;
}

export interface LocationSlot {
    active: number;
    total: number;
    pending: number;
    conflicts: number;
    duration: number;
    timestamp: TimestampShort;
    remote: boolean;
}

export interface LocationsRequest {
    temporary: boolean;
    inviteOnly: boolean;
    operational: boolean;
    serviceName: ServiceTypes;
}

export interface LocationSlotsRequest {
    startTimestamp: Timestamp;
    endTimestamp: Timestamp;
}

export interface CompositeData {
    slots: Slot[];
    location: Location;
}

export class Client {
    private transport: AxiosInstance;

    constructor() {
        this.transport = axios.create({
            baseURL: 'https://ttp.cbp.dhs.gov/schedulerapi',
            headers: {
                "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
            }
        })
    }

    locations(req: LocationsRequest): Promise<Location[]> {
        return this.transport.get("/locations/", {
            params: req
        }).then(r => r.data)
    }

    slotsAsLocations(req: SlotsAsLocationsRequest): Promise<Location[]> {
        return this.transport.get("/slots/asLocations", {
            params: req
        }).then(r => r.data)
    }

    // free slots only
    slots(req: SlotsRequest): Promise<Slot[]> {
        return this.transport.get("/slots", {
            params: req
        }).then(r => r.data)
    }

    // returns all slots with a slightly different format
    locationSlots(locationId: number, req: LocationSlotsRequest): Promise<LocationSlot[]> {
        return this.transport.get(`/locations/${locationId}/slots`, {
            params: req
        }).then(r => r.data)
    }
}