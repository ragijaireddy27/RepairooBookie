const { Service } = require('../models'); // Assuming a Service model is set up
const { Worker } = require('../models'); // Assuming a Worker model is set up

// Get all available services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find(); // Mongoose equivalent of finding all documents

        if (services.length === 0) {
            return res.status(404).json({ message: "No services available" });
        }

        res.status(200).json({ services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: "Error fetching services" });
    }
};

// Get services provided by a specific worker
const getWorkerServices = async (req, res) => {
    const workerId = req.worker.id; // Assuming worker ID is stored in JWT payload

    try {
        const worker = await Worker.findById(workerId); // Mongoose method to find a document by ID

        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        const services = await Service.find({ worker_id: workerId }); // Mongoose find by worker_id

        if (services.length === 0) {
            return res.status(404).json({ message: "No services found for this worker" });
        }

        res.status(200).json({ services });
    } catch (error) {
        console.error("Error fetching worker services:", error);
        res.status(500).json({ message: "Error fetching worker services" });
    }
};

// Add a new service (worker adds a service)
const addService = async (req, res) => {
    const workerId = req.worker.id; // Assuming worker ID is stored in JWT payload
    const { serviceName, description, price } = req.body;

    try {
        // Validate input
        if (!serviceName || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newService = new Service({
            service_name: serviceName,
            description,
            price,
            worker_id: workerId, // Associate service with worker
        });

        const savedService = await newService.save(); // Save the service to MongoDB

        res.status(201).json({ message: "Service added successfully", service: savedService });
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ message: "Error adding service" });
    }
};

// Update a service (worker updates their service)
const updateService = async (req, res) => {
    const { serviceId } = req.params; // ID of the service to update
    const workerId = req.worker.id; // Assuming worker ID is stored in JWT payload
    const { serviceName, description, price } = req.body;

    try {
        const service = await Service.findById(serviceId); // Mongoose method to find a service by ID

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.worker_id.toString() !== workerId.toString()) {
            return res.status(403).json({ message: "You can only update your own services" });
        }

        // Update service details
        service.service_name = serviceName || service.service_name;
        service.description = description || service.description;
        service.price = price || service.price;

        const updatedService = await service.save(); // Save the updated service

        res.status(200).json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Error updating service" });
    }
};

// Delete a service (worker removes a service)
const deleteService = async (req, res) => {
    const { serviceId } = req.params; // ID of the service to delete
    const workerId = req.worker.id; // Assuming worker ID is stored in JWT payload

    try {
        const service = await Service.findById(serviceId); // Mongoose method to find a service by ID

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.worker_id.toString() !== workerId.toString()) {
            return res.status(403).json({ message: "You can only delete your own services" });
        }

        await service.remove(); // Mongoose method to delete the service

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Error deleting service" });
    }
};

module.exports = {
    getAllServices,
    getWorkerServices,
    addService,
    updateService,
    deleteService,
};
