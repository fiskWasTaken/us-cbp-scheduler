import axios, {AxiosInstance, AxiosPromise, AxiosResponse} from "axios";

export type Timestamp = string;

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
    effectiveDate: string; // weird format, 2008-10-02T04:00
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
    startTimestamp: string; // weird format
    endTimestamp: string; // weird format
}

export interface LocationSlot {
    active: number;
    total: number;
    pending: number;
    conflicts: number;
    duration: number;
    timestamp: string; // weird format
    remote: boolean;
}

export interface LocationsRequest {
    temporary: boolean;
    inviteOnly: boolean;
    operational: boolean;
    serviceName: boolean;
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
        this.transport = axios.create({baseURL: 'https://ttp.cbp.dhs.gov'})
    }

    locations(req: LocationsRequest): Promise<Location[]> {
        return this.transport.get("/schedulerapi/locations", {
            params: req
        }).then(r => r.data)
    }

    slotsAsLocations(req: SlotsAsLocationsRequest): Promise<Location[]> {
        return this.transport.get("/schedulerapi/slots/asLocations", {
            params: req
        }).then(r => r.data)
    }

    // free slots only
    slots(req: SlotsRequest): Promise<Slot[]> {
        return this.transport.get("/schedulerapi/slots", {
            params: req
        }).then(r => r.data)
    }

    // returns all slots with a slightly different format
    locationSlots(locationId: number, req: LocationSlotsRequest): Promise<LocationSlot[]> {
        return this.transport.get(`/schedulerapi/locations/${locationId}/slots`, {
            params: req
        }).then(r => r.data)
    }
}