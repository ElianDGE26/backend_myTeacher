import { IAvailabilityRepository, IAvailabilityService, Availability } from "../types/availabilityTypes";
import { AvailabilityRepository } from "../repositories/availabilityRepositories";
import { AvailabilityService } from "../services/availabilityService";
import { Request, Response } from "express";

const availabilityRepository: IAvailabilityRepository = new AvailabilityRepository();
const availabilityService: IAvailabilityService = new AvailabilityService(availabilityRepository);



export const getAllAvailabilities = async (req: Request, res: Response) => {
    try {

        const result =  await availabilityService.findAllAvailabilities();

        if (result.length === 0) {
            return res.status(404).json({ message: "No Availabilitys found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAvailabilityByid = async (req: Request, res: Response) => {
    try {
        const { id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Availability ID in params" });
        }
        
        const result =  await availabilityService.findAvailabilityById(id);

        if (!result) {
            return res.status(404).json({ message: "No Availability found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const createAvailability = async (req: Request, res: Response) => {
    try {

        const newAvailability: Availability = req.body;

        const result =  await availabilityService.createAvailability(newAvailability);

        res.status(201).json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(400).json({ message: "Internal server error" });
    }
}


export const updateAvailabilityByid = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const availabilityUpdate: Availability = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing Availability ID in params" });
        }

        const result =  await availabilityService.updateAvailabilityById(id, availabilityUpdate);

        if (!result) {
            return res.status(404).json({ message: "Availability not found" });
        }

        res.json(result);
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteAvailabilityByid = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Missing Availability ID in params" });
        }

        const result =  await availabilityService.deleteAvailabilityById(id);

        if (!result) {
            return res.status(404).json({ message: "Availability not found" });
        }   
        res.json({ success: result });
        
    } catch (error) {
        console.error("Error fetching Availabilitys:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
