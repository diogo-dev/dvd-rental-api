import { Request, Response } from "express";
import { StaffService } from "@/services/StaffService";
import z from "zod";

export class StaffController {
  constructor(private staffService: StaffService) {}

  async registerStaff(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      username: z.string().min(4),
      password: z.string().min(6),
      addressId: z.string().uuid(),
      storeId: z.string().uuid(),
    });

    const params = schema.parse(req.body);

    try {
      const staff = await this.staffService.registerStaff(
        params.firstName,
        params.lastName,
        params.email,
        params.username,
        params.password,
        params.addressId,
        params.storeId
      );
      res.status(201).json(staff);
    } catch (error) {
      console.error("Error registering staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async authenticate(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      username: z.string().min(4),
      password: z.string().min(6),
    });

    const params = schema.parse(req.body);

    try {
      const staff = await this.staffService.authenticate(
        params.username,
        params.password
      );
      if (!staff) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      res.status(200).json(staff);
    } catch (error) {
      console.error("Error authenticating staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getStaffById(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      staffId: z.string().uuid(),
    });

    const { staffId } = schema.parse(req.params);

    try {
      const staff = await this.staffService.getStaffById(staffId);
      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }
      res.status(200).json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getStaffByStore(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      storeId: z.string().uuid(),
    });

    const { storeId } = schema.parse(req.params);

    try {
      const staffList = await this.staffService.getStaffByStore(storeId);
      res.status(200).json(staffList);
    } catch (error) {
      console.error("Error fetching staff by store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateStaffInfo(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({
      staffId: z.string().uuid(),
    });

    const bodySchema = z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      addressId: z.string().uuid().optional(),
    });

    const { staffId } = paramsSchema.parse(req.params);
    const staffData = bodySchema.parse(req.body);

    try {
      const staff = await this.staffService.updateStaffInfo(staffId, staffData);
      res.status(200).json(staff);
    } catch (error) {
      console.error("Error updating staff info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const paramsSchema = z.object({
      staffId: z.string().uuid(),
    });

    const bodySchema = z.object({
      currentPassword: z.string().min(6),
      newPassword: z.string().min(6),
    });

    const { staffId } = paramsSchema.parse(req.params);
    const { currentPassword, newPassword } = bodySchema.parse(req.body);

    try {
      const success = await this.staffService.changePassword(
        staffId,
        currentPassword,
        newPassword
      );
      if (!success) {
        res.status(400).json({ error: "Current password is incorrect" });
        return;
      }
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deactivateStaff(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      staffId: z.string().uuid(),
    });

    const { staffId } = schema.parse(req.params);

    try {
      const staff = await this.staffService.deactivateStaff(staffId);
      res.status(200).json(staff);
    } catch (error) {
      console.error("Error deactivating staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async activateStaff(req: Request, res: Response): Promise<void> {
    const schema = z.object({
      staffId: z.string().uuid(),
    });

    const { staffId } = schema.parse(req.params);

    try {
      const staff = await this.staffService.activateStaff(staffId);
      res.status(200).json(staff);
    } catch (error) {
      console.error("Error activating staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getActiveStaff(req: Request, res: Response): Promise<void> {
    try {
      const staffList = await this.staffService.getActiveStaff();
      res.status(200).json(staffList);
    } catch (error) {
      console.error("Error fetching active staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
