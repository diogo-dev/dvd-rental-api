import { Pool } from "pg";
import { StaffRepo } from "@/repositories/StaffRepo";
import { Staff } from "@/entities/Staff";
import bcrypt from "bcrypt";

export class StaffService {
  private staffRepo: StaffRepo;

  constructor(pool: Pool) {
    this.staffRepo = new StaffRepo(pool);
  }

  async registerStaff(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    addressId: string,
    storeId: string
  ): Promise<Staff> {
    const existingStaff = await this.staffRepo.findByEmail(email);
    if (existingStaff) {
      throw new Error("Email is already registered");
    }

    const existingUsername = await this.staffRepo.findByUsername(username);
    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const staff = new Staff(
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
      addressId,
      storeId,
    );
    // Save (staffRepo.create)
    const createdStaff = await this.staffRepo.create(staff);
    // Return staff (without exposing the password)
    return createdStaff ;
  }

  async authenticate(username: string, password: string): Promise<Staff | null> {
    // Authenticate staff member
    const staff = await this.staffRepo.findByUsername(username);
    if (!staff) {
      return null;
    }
    if (!staff.active) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return null;
    }  

    return staff;
  }

  async getStaffById(staffId: string): Promise<Staff | null> {
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      return null;
    }
    return staff;
  }

  async getStaffByStore(storeId: string): Promise<Staff[]> {
    const staffList = await this.staffRepo.findByStore(storeId);
    if (staffList.length === 0) {
      throw new Error("No staff found for the specified store");
    }
    return staffList;
  }

  async updateStaffInfo(
    staffId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      addressId?: string;
    }
  ): Promise<Staff> {
    // Update staff member information
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    // If email was changed, check if it's not already in use
    if (data.email && data.email !== staff.email) {
      const existingStaff = await this.staffRepo.findByEmail(data.email);
      if (existingStaff && existingStaff.id !== staffId) {
        throw new Error("Email is already in use by another staff member");
      }
    }
    // Update the provided fields
    if (data.firstName !== undefined) {
      staff.first_name = data.firstName;
    }
    if (data.lastName !== undefined) {
      staff.last_name = data.lastName;
    }
    if (data.email !== undefined) {
      staff.email = data.email;
    }
    if (data.addressId !== undefined) {
      staff.address_id = data.addressId;
    }
  
    const updatedStaff = await this.staffRepo.update(staff);
    if (!updatedStaff) {
      throw new Error("Failed to update staff");
    }
  
    return updatedStaff;
  }

  async changePassword(
    staffId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // Change staff member password
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    // Verify current password using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(currentPassword, staff.password);
    if (!isPasswordValid) {
      return false;
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update staff.password
    staff.password = hashedPassword;
    await this.staffRepo.update(staff);
    
    return true;
  }

  async deactivateStaff(staffId: string): Promise<Staff> {
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }

    staff.active = false;
    const updatedStaff = await this.staffRepo.update(staff);
    if (!updatedStaff) {
      throw new Error("Failed to deactivate staff");
    }

    return updatedStaff;
  }

  async activateStaff(staffId: string): Promise<Staff> {
    // Reactivate staff member
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
  
    staff.active = true;
    const updatedStaff = await this.staffRepo.update(staff);
    if (!updatedStaff) {
      throw new Error("Failed to activate staff");
    }
   
    return updatedStaff;
  }

  async getActiveStaff(): Promise<Staff[]> {
    const activeStaff = await this.staffRepo.findActive();
    if (activeStaff.length === 0) {
      throw new Error("No active staff found");
    }
    return activeStaff;
  }
}
