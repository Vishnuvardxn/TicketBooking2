import React from 'react'

const TicketPrint = ({ ticket }) => {
    const generateTicketId = () => `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    return (
        <div className="hidden print:block">
            {ticket.seats.map((seat, index) => (
                <div key={index} className={index > 0 ? 'mt-8 break-before-page' : ''}>
                    <div className="m-4 flex flex-col rounded-lg border-2 border-dashed border-indigo-600 p-6">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-indigo-800">{ticket.showtime.theater.cinema.name}</h2>
                                <p className="text-lg">Theater {ticket.showtime.theater.number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Ticket ID:</p>
                                <p className="font-mono text-lg font-bold">{generateTicketId()}</p>
                            </div>
                        </div>
                        
                        <div className="my-4 border-b-2 border-dotted border-indigo-300"></div>
                        
                        <div className="flex justify-between gap-4">
                            <div className="flex gap-4">
                                <img 
                                    src={ticket.showtime.movie.img} 
                                    alt={ticket.showtime.movie.name}
                                    className="h-40 w-auto object-contain"
                                />
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold">{ticket.showtime.movie.name}</h3>
                                    <p className="text-gray-600">Length: {ticket.showtime.movie.length} min</p>
                                    <p className="mt-2">
                                        <span className="font-semibold">Seat: </span>
                                        {seat.row}{seat.number}
                                    </p>
                                    <p className="mt-1">
                                        <span className="font-semibold">Price: </span>
                                        ${ticket.showtime.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold">
                                    {new Date(ticket.showtime.showtime).toLocaleString('default', { weekday: 'long' })}
                                </p>
                                <p className="text-gray-600">
                                    {new Date(ticket.showtime.showtime).toLocaleDateString('default', { 
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-indigo-800">
                                    {new Date(ticket.showtime.showtime).toLocaleTimeString('default', { 
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                </p>
                            </div>
                        </div>
                        
                        <div className="my-4 border-b-2 border-dotted border-indigo-300"></div>
                        
                        <div className="text-center text-sm text-gray-500">
                            <p>Please arrive 15 minutes before showtime</p>
                            <p>This ticket is valid only for the specified showtime</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TicketPrint 