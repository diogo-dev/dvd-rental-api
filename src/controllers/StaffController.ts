import { Request, Response, NextFunction } from "express";
import { StaffService } from "@/services/StaffService";
import z from "zod";

export class StaffController {
  constructor(private staffService: StaffService) {}

  async registerStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
      next(error);
    }
  }

  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        username: z.string().min(4),
        password: z.string().min(6),
      });

      const params = schema.parse(req.body);

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
      next(error);
    }
  }

  async getStaffById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        staffId: z.string().uuid(),
      });

      const { staffId } = schema.parse(req.params);

      const staff = await this.staffService.getStaffById(staffId);
      if (!staff) {
        res.status(404).json({ error: "Staff not found" });
        return;
      }
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  async getStaffByStore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        storeId: z.string().uuid(),
      });

      const { storeId } = schema.parse(req.params);

      const staffList = await this.staffService.getStaffByStore(storeId);
      res.status(200).json(staffList);
    } catch (error) {
      next(error);
    }
  }

  async updateStaffInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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

      const staff = await this.staffService.updateStaffInfo(staffId, staffData);
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paramsSchema = z.object({
        staffId: z.string().uuid(),
      });

      const bodySchema = z.object({
        currentPassword: z.string().min(6),
        newPassword: z.string().min(6),
      });

      const { staffId } = paramsSchema.parse(req.params);
      const { currentPassword, newPassword } = bodySchema.parse(req.body);

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
      next(error);
    }
  }

  async deactivateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        staffId: z.string().uuid(),
      });

      const { staffId } = schema.parse(req.params);

      const staff = await this.staffService.deactivateStaff(staffId);
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  async activateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const schema = z.object({
        staffId: z.string().uuid(),
      });

      const { staffId } = schema.parse(req.params);

      const staff = await this.staffService.activateStaff(staffId);
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  async getActiveStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const staffList = await this.staffService.getActiveStaff();
      res.status(200).json(staffList);
    } catch (error) {
      next(error);
    }
  }
}
