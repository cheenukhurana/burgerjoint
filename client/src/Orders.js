import React, { useEffect, useState } from 'react';
import './Orders.css'

function OrdersTable(props)
{
    return (
        <>
            <tr>
                {Object.keys(props.order).map((key)=><td>{props.order[key]}</td>)}
            </tr> 
        </>
    )
}

function Orders()
{
    const [allOrders,setAllOrders] = useState(null);
    const [uniqueOrders,setUniqueOrders] = useState(null);
    const [ordersToDisplay, setOrdersToDisplay] = useState(null);
    const [lastTableRow,setLastTableRow] = useState(null);
    const [filterPersonOption,setFilterPersonOption] = useState("All");

    useEffect(()=>{

        fetch("http://localhost:9000/allOrders")
        .then(res=>{
            return res.json();
        })
        .then(data=>{
            if(data.length)
            {
                setAllOrders(data)
            }
        });
    },[])

    useEffect(()=>{

        if(allOrders)
        {
            setUniqueOrders([...new Map(allOrders.map(order => [order.Person, order])).values()]);
        
            let displayOrders = [];
            if(filterPersonOption=="All")
            {
                displayOrders = allOrders;
            }
            else
            {
                for(let i=0;i<allOrders.length;i++)
                {
                    if(allOrders[i].Person === filterPersonOption)
                    {
                        displayOrders.push(allOrders[i]);
                    }
                }
            }
            setOrdersToDisplay(displayOrders);
        }
    },[allOrders,filterPersonOption])

    useEffect(()=>{
        if(ordersToDisplay)
        {
            let obj = ["Total"];
            for(let i=1;i<Object.keys(ordersToDisplay[0]).length;i++)
            {
                obj.push(0);
            }
            for(let i=0;i<ordersToDisplay.length;i++)
            {
                for(let j=1;j<Object.keys(ordersToDisplay[i]).length;j++)
                {
                    obj[j] = Number(obj[j])+ Number(Object.values(ordersToDisplay[i])[j]);
                }
            }
            setLastTableRow(obj);
        }

    },[ordersToDisplay]);

    function filterHandler(e)
    {
        setFilterPersonOption(e.target.value);
    }

    return (
        <div className="orders-table">
            {
                uniqueOrders && ordersToDisplay && (
                    <>
                        <div className="filter-by">
                            <label className="label" htmlFor="persons">Filter by Person</label>
                            <select id="select-person" name='persons' onChange={filterHandler}>
                                <option value="All">All</option>
                                {uniqueOrders.map(order=><option value={order.Person}>{order.Person}</option>)}
                            </select>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(ordersToDisplay[0]).map(key=><th>{key}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {ordersToDisplay.map((order)=><OrdersTable order={order} filterPersonOption={filterPersonOption}/>)}
                            </tbody>
                            {lastTableRow && (
                                <tfoot>
                                    <tr>
                                        {lastTableRow.map(val=><td>{val}</td>)}
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </>
                )
            }
            {
                !allOrders && (
                    <h3>No Orders to Display. Please Place an Order</h3>
                )
            }
        </div>
    )
}

export default Orders;