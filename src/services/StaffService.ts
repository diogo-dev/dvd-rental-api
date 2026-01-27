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
    // TODO: Register new staff member
    // 1. Validate if email already exists (staffRepo.findByEmail)
    const existingStaff = await this.staffRepo.findByEmail(email);
    if (existingStaff) {
      throw new Error("Email is already registered");
    }
    // 2. Validate if username already exists (staffRepo.findByUsername)
    const existingUsername = await this.staffRepo.findByUsername(username);
    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    // 4. Hash the password using bcrypt (bcrypt.hash(password, 10))
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // 5. Create staff with active = true and hashed password
    const staff = new Staff(
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
      addressId,
      storeId,
    );
    // 6. Save (staffRepo.create)
    const createdStaff = await this.staffRepo.create(staff);
    // 7. Return staff (without exposing the password)
    return createdStaff ;
  }

  async authenticate(username: string, password: string): Promise<Staff | null> {
    // TODO: Authenticate staff member
    // 1. Find staff by username (staffRepo.findByUsername)
    const staff = await this.staffRepo.findByUsername(username);
    // 2. If not found, return null
    if (!staff) {
      return null;
    }
    // 3. Check if staff is active
    if (!staff.active) {
      return null;
    }
    // 4. Compare password using bcrypt (bcrypt.compare(password, staff.password))
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    // 5. If password doesn't match, return null
    if (!isPasswordValid) {
      return null;
    }
    // 6. Return staff (without exposing the password)
    return staff;
  }

  async getStaffById(staffId: string): Promise<Staff | null> {
    // TODO: Find staff member by ID
    // 1. Use staffRepo.findById
    const staff = await this.staffRepo.findById(staffId);
    // 2. If found, remove password before returning
    // 3. Return staff or null
    return staff;
  }

  async getStaffByStore(storeId: string): Promise<Staff[]> {
    // TODO: Find staff members of a store
    // 1. Use staffRepo.findByStore
    const staffList = await this.staffRepo.findByStore(storeId);
    // 2. Remove passwords from all staff before returning
    // 3. Return list of staff
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
    // TODO: Update staff member information
    // 1. Find staff (staffRepo.findById)
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    // 2. If email was changed, check if it's not already in use
    if (data.email && data.email !== staff.email) {
      const existingStaff = await this.staffRepo.findByEmail(data.email);
      if (existingStaff && existingStaff.id !== staffId) {
        throw new Error("Email is already in use by another staff member");
      }
    }
    // 3. Update the provided fields
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
    // 4. Save (staffRepo.update)
    const updatedStaff = await this.staffRepo.update(staff);
    if (!updatedStaff) {
      throw new Error("Failed to update staff");
    }
    // 5. Return updated staff (without password)
    return updatedStaff;
  }

  async changePassword(
    staffId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    // TODO: Change staff member password
    // 1. Find staff (staffRepo.findById)
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    // 2. Verify current password using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(currentPassword, staff.password);
    // 3. If current password doesn't match, return false
    if (!isPasswordValid) {
      return false;
    }
    // 4. Hash new password (bcrypt.hash(newPassword, 10))
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // 5. Update staff.password
    staff.password = hashedPassword;
    // 6. Save (staffRepo.update)
    await this.staffRepo.update(staff);
    // 7. Return true
    return true;
  }

  async deactivateStaff(staffId: string): Promise<Staff> {
    // TODO: Deactivate staff member
    // 1. Find staff (staffRepo.findById)
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    // 2. Update staff.active = false
    staff.active = false;
    // 3. Save (staffRepo.update)
    const updatedStaff = await this.staffRepo.update(staff);
    if (!updatedStaff) {
      throw new Error("Failed to deactivate staff");
    }
    // 4. Return updated staff (without password)
    return updatedStaff;
  }

  async activateStaff(staffId: string): Promise<Staff> {
    // TODO: Reactivate staff member
    // 1. Find staff (staffRepo.findById)
    const staff = await this.staffRepo.findById(staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    // 2. Update staff.active = true
    staff.active = true;
    // 3. Save (staffRepo.update)
    const updatedStaff = await this.staffRepo.update(staff);
    if (!updatedStaff) {
      throw new Error("Failed to activate staff");
    }
    // 4. Return updated staff (without password)
    return updatedStaff;
  }

  async getActiveStaff(): Promise<Staff[]> {
    // TODO: Fetch all active staff members
    // 1. Use staffRepo.findActive
    const activeStaff = await this.staffRepo.findActive();
    // 2. Remove passwords from all before returning
    // 3. Return list of active staff
    return activeStaff;
  }
}
