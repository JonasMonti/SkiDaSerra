export type Pacote = {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
};

/**
 * Model Client
 * 
 */
export type Client = {
    id: string
    name: string
    address: string
    taxId: string
  }
  
  /**
   * Model Reservation
   * 
   */
  export type Reservation = {
    id: string
    clientId: string
    serviceType: ServiceType
    totalPrice: number
  }
  
  /**
   * Model Lesson
   * 
   */
  export type Lesson = {
    id: string
    slopeLevel: SlopeLevel
    hours: number
    students: number
    teacherId: string | null
    reservationId: string | null
  }
  
  /**
   * Model SlopeAccess
   * 
   */
  export type SlopeAccess = {
    id: string
    slopeLevel: SlopeLevel
    reservationId: string | null
  }
  
  /**
   * Model Course
   * 
   */
  export type Course = {
    id: string
    image: string
    title: string
    description: string
    reservationId: string | null
  }
  
  /**
   * Model Teacher
   * 
   */
  export type Teacher = {
    id: string
    name: string
    address: string
    taxId: string
  }
  
  /**
   * Model ServiceDay
   * 
   */
  export type ServiceDay = {
    id: string
    day: Date
    timeOfDay: TimeOfDay
    reservationId: string | null
  }

/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export enum ServiceType {
  SLOPE_ACCESS,
  SKI_LESSON,
}

export enum SlopeLevel {
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
}

export enum TimeOfDay {
  MORNING,
  AFTERNOON,
  ALL_DAY,
}
