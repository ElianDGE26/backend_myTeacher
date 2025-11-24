import { IPqrRepository, IPqrService } from "../types/pqrTypes";
import { PqrRepository } from "../repositories/pqrRepositories";
import { PqrService } from "../services/pqrService";
import { Pqr } from "../types/pqrTypes";
import { Request, Response } from "express";
import mongoose from "mongoose";

const pqrRepository: IPqrRepository = new PqrRepository();
const pqrService: IPqrService = new PqrService(pqrRepository);

export const getAllPqrs = async (req: Request, res: Response) => {
  try {
    const result = await pqrService.findAllPqrs();

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPqrByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Pqr ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await pqrService.findPqrById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "No Pqr found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPqr = async (req: Request, res: Response) => {
  try {
    const newPqr: Pqr = req.body;

    const result = await pqrService.createPqr(newPqr);

    res.status(201).json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(400).json({ message: "Internal server error" });
  }
};

export const updatePqrByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pqrUpdate: Pqr = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing Pqr ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await pqrService.updatePqrById(
      new mongoose.Types.ObjectId(id),
      pqrUpdate
    );

    if (!result) {
      return res.status(404).json({ message: "Pqr not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePqrByid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing Pqr ID in params" });
    }

    //se valida que el id si sea de tipo Object ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Booking Id" });
    }

    const result = await pqrService.deletePqrById(
      new mongoose.Types.ObjectId(id)
    );

    if (!result) {
      return res.status(404).json({ message: "Pqr not found" });
    }
    res.json({ success: result });
  } catch (error) {
    console.error("Error fetching Pqrs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
