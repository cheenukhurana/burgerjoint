import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import './Home.css'

function Home()
{

    const [buns] = useState(2);
    const [salad,setSalad] = useState("0");
    const [cheeseSlices,setCheeseSlices] = useState(0);
    const [cutlets,setCutlets] = useState(0);
    const [prices,setPrices] = useState(null);
    const [totalPrice,setTotalPrice] = useState(0);
    const [orderPlaced,setOrderPlaced] = useState(false);

    useEffect(()=>{
        fetch('http://localhost:9000/prices')
        .then(res=>res.json())
        .then(data=>{
            setPrices(data)
        })
    },[]);

    useEffect(()=>{
        if(prices)
        {
            let total = prices.bun*buns+prices.cheeseSlice*cheeseSlices+prices.cutlet*cutlets;
            total = salad==="1"?total+prices.salad:total;
            setTotalPrice(total);
        }
    },[buns,salad,cheeseSlices,cutlets,prices])


    function handlePlaceOrder(e)
    {
        e.preventDefault();

        let formElement = document.getElementById("burger-menu-form");
        let formData = new FormData(formElement);
        formData.append("total",totalPrice);

        fetch(formElement.action,{
            method: "POST",
            body: new URLSearchParams(formData)
        })
        .then(setOrderPlaced(true));
    }

    return (
        <div className = "order-page">
            <form id="burger-menu-form" action = "http://localhost:9000/order" onSubmit = {handlePlaceOrder} >
                <input type="text" name="Person" className="form-input-name" placeholder="Enter Your Name Here" required/><br/>
                <label className="form-input-label" htmlFor="Buns">Buns:</label>
                <input type="number" name="Buns" className="form-input" value={buns} readOnly /><br/>
                <label className="form-input-label" htmlFor="Salad">Salad:</label>
                <select className="form-input" name="Salad" onChange={e=>setSalad(e.target.value)}>
                    <option className="form-input" value="0">No</option>
                    <option className="form-input" value="1">Yes</option>
                </select><br/>
                <label className="form-input-label" htmlFor="Cheese Slices">Cheese Slices:</label>
                <input type="number" min="0" name="Cheese Slices" className="form-input" value={cheeseSlices} onChange={e=>setCheeseSlices(e.target.value)} required /><br/>
                <label className="form-input-label" htmlFor="Cutlets">Cutlets:</label>
                <input type="number" min="0" name="Cutlets" className="form-input" value={cutlets} onChange={e=>setCutlets(e.target.value)} required /><br/><br/>
                <div id="totalPrice">Total Price: {totalPrice}</div><br/>
                <input type="submit" value="Place Order" />
            </form>
            <h4 style={{"visibility":orderPlaced?("visible"):("hidden")}}>Your Order Has Been Placed Successfully</h4>
            <br/><br/><br/>
            <h3 style={{"textAlign":"center"}}><Link to="/orders">See All Orders</Link></h3>
        </div>
    )
}

export default Home;