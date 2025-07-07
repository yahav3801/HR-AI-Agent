import { useEffect, useState } from "react";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/employees");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, setEmployees, isLoading, fetchEmployees };
};

// Employee types for frontend
export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ContactDetails {
  email: string;
  phone_number: string;
}

export interface JobDetails {
  job_title: string;
  department: string;
  hire_date: string;
  employment_type: string;
  salary: number;
  currency: string;
}

export interface WorkLocation {
  nearest_office: string;
  is_remote: boolean;
}

export interface PerformanceReview {
  review_date: string;
  rating: number;
  comments: string;
}

export interface Benefits {
  health_insurance: string;
  retirement_plan: string;
  paid_time_off: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
}

export interface Employee {
  employee_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  address: Address;
  contact_details: ContactDetails;
  job_details: JobDetails;
  work_location: WorkLocation;
  reporting_manager: string | null;
  skills: string[];
  performance_reviews: PerformanceReview[];
  benefits: Benefits;
  emergency_contact: EmergencyContact;
  notes: string;
}
