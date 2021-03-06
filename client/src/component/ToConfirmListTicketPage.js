import React from 'react';
import { useSelector } from 'react-redux';
import ListTicketTablePage from './ListTicketTablePage';
import LoadingPage from './LoadingPage';
import Typography from '@material-ui/core/Typography';

/* Component to render wait to confirm ticket list
    fetch tickets with pending activity
    Pass tickets to ListTicketTablePage component
*/
const ToConfirmListTicketPage = () => {
    const tickets = useSelector((state) => {
        return state.tickets.filter((ticket) => ticket.Ticket_Activity.activity === 'pending');
    });
    return (
        <div>
            <Typography variant='h5'>Tickets to confirm</Typography>
            {tickets
                ? <div>
                    {tickets.length > 0
                        ? <ListTicketTablePage tickets={tickets} />
                        : <p>No tickets to confirm</p>}
                </div>
                : <LoadingPage />
            }
        </div>
    );
};

export default ToConfirmListTicketPage;