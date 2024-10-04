"use server";

import { apiClient } from "@/lib/internal-api/api-client";
import { CompanyData } from "@/lib/internal-api/types";
import { getCurrentUser } from "@/actions/user/get-user-data";

export async function getCompanies(): Promise<CompanyData[] | null> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.company_details?.uuid) {
      console.error(
        "No authenticated user found or user has no associated company"
      );
      return null;
    }

    const companyId = currentUser.company_details.uuid;
    const response = await apiClient.companies.get(companyId);

    if (response.success && response.data.length > 0) {
      return response.data;
    } else {
      console.error("Companies not found:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error in getCompanies:", error.message);
    return null;
  }
}