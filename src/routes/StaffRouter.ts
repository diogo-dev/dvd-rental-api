import Router from "express";
import { StaffService } from "@/services/StaffService";
import { StaffController } from "@/controllers/StaffController";
import pool from "@/config/db/pool_pg";

export const StaffRouter = Router();
const staffService = new StaffService(pool);
const staffController = new StaffController(staffService);

// Register a new staff member
StaffRouter.post("/", async (req, res, next) => {
  await staffController.registerStaff(req, res, next);
});

// Authenticate staff member (login)
StaffRouter.post("/login", async (req, res, next) => {
  await staffController.authenticate(req, res, next);
});

// Get all active staff members
StaffRouter.get("/active", async (req, res, next) => {
  await staffController.getActiveStaff(req, res, next);
});

// Get staff by ID
StaffRouter.get("/:staffId", async (req, res, next) => {
  await staffController.getStaffById(req, res, next);
});

// Get staff by store
StaffRouter.get("/store/:storeId", async (req, res, next) => {
  await staffController.getStaffByStore(req, res, next);
});

// Update staff information
StaffRouter.patch("/:staffId", async (req, res, next) => {
  await staffController.updateStaffInfo(req, res, next);
});

// Change staff password
StaffRouter.patch("/:staffId/password", async (req, res, next) => {
  await staffController.changePassword(req, res, next);
});

// Deactivate staff
StaffRouter.patch("/:staffId/deactivate", async (req, res, next) => {
  await staffController.deactivateStaff(req, res, next);
});

// Activate staff
StaffRouter.patch("/:staffId/activate", async (req, res, next) => {
  await staffController.activateStaff(req, res, next);
});
