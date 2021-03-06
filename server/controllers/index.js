const { Ticket_Activity, Ticket_Status, Ticket, Ticket_Levels_Priority } = require('../models/index');
const { v4 } = require('uuid');
const attributesToDisplay = ['title', 'ticketNumber', 'email', 'problemDescription', 'createdAt'];

/* Route to fetch all tickets */
const getTickets = async (req, res) => {
    try {
        const ticketsList = await Ticket.findAll({
            attributes: attributesToDisplay,
            include: [
                {
                    model: Ticket_Activity,
                    attributes: ['id', 'activity']
                },
                {
                    model: Ticket_Status,
                    attributes: ['id', 'status']
                },
                {
                    model: Ticket_Levels_Priority,
                    attributes: ['id', 'levelPriority']
                }
            ]
        });
        return res.status(200).send({ response: ticketsList });
    } catch (error) {
        return res.status(500).send({ error: "error getting tickets" });
    }
}

/* Route to create new ticket with pending and OPEN id and data from client */
const createTicket = async (req, res) => {
    try {
        const openTicketActivityId = await Ticket_Activity.findOne({ attributes: ['id'], where: { activity: "pending" } });
        const openTicketStatusId = await Ticket_Status.findOne({ attributes: ['id'], where: { status: "OPEN" } });
        const data = req.body;
        const newTicket = await Ticket.create({
            ...data,
            ticketNumber: v4(),
            ticketActivitesId: openTicketActivityId.id,
            ticketStatusId: openTicketStatusId.id
        });

        const ticketCreated = await Ticket.findOne({
            attributes: attributesToDisplay,
            include: [
                {
                    model: Ticket_Activity,
                    attributes: ['id', 'activity']
                },
                {
                    model: Ticket_Status,
                    attributes: ['id', 'status']
                },
                {
                    model: Ticket_Levels_Priority,
                    attributes: ['id', 'levelPriority']
                }
            ],
            where: { id: newTicket.id }
        });
        return res.status(201).send({ newTicket: ticketCreated });
    } catch (error) {
        return res.status(500).send({ error: "Error creating ticket" });
    }
};

/* Route to update ticket by ticket number */
const updateTicket = async (req, res) => {
    try {
        const ticketNumber = req.params.id;
        const data = req.body;
        
        let ticket = await Ticket.findOne({ where: { ticketNumber: ticketNumber } });
        if (!ticket)
            throw new Error('Ticket not found');
        ticket = await ticket.update(
            { ...data },
            { where: { ticketNumber: ticketNumber } });

        const ticketUpdated = await Ticket.findOne({
            attributes: attributesToDisplay,
            include: [
                {
                    model: Ticket_Activity,
                    attributes: ['id', 'activity']
                },
                {
                    model: Ticket_Status,
                    attributes: ['id', 'status']
                },
                {
                    model: Ticket_Levels_Priority,
                    attributes: ['id', 'levelPriority']
                }
            ],
            where: { ticketNumber: ticket.ticketNumber }
        });
        return res.status(200).send({ updatedTicket: ticketUpdated });
    } catch (error) {
        return res.status(500).send({ error: "Error updating ticket" });
    }
};

module.exports = { getTickets, createTicket, updateTicket }