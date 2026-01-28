import Router from "express";
import { StaffService } from "@/services/StaffService";
import { StaffController } from "@/controllers/StaffController";
import pool from "@/config/db/pool_pg";

export const StaffRouter = Router();
const staffService = new StaffService(pool);
const staffController = new StaffController(staffService);

// Register a new staff member
StaffRouter.post("/staff/register", async (req, res) => {
  await staffController.registerStaff(req, res);
});

// Authenticate staff member (login)
StaffRouter.post("/auth/login", async (req, res) => {
  await staffController.authenticate(req, res);
});

// Get all active staff members
StaffRouter.get("/active", async (req, res) => {
  await staffController.getActiveStaff(req, res);
});

// Get staff by ID
StaffRouter.get("/:staffId", async (req, res) => {
  await staffController.getStaffById(req, res);
});

// Get staff by store
StaffRouter.get("/store/:storeId", async (req, res) => {
  await staffController.getStaffByStore(req, res);
});

// Update staff information
StaffRouter.patch("/:staffId", async (req, res) => {
  await staffController.updateStaffInfo(req, res);
});

// Change staff password
StaffRouter.patch("/:staffId/password", async (req, res) => {
  await staffController.changePassword(req, res);
});

// Deactivate staff
StaffRouter.patch("/:staffId/deactivate", async (req, res) => {
  await staffController.deactivateStaff(req, res);
});

// Activate staff
StaffRouter.patch("/:staffId/activate", async (req, res) => {
  await staffController.activateStaff(req, res);
});
