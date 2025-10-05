import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { adminModeSetter } from "./App";

function Create() {
    const { isAdmin } = adminModeSetter();
    const [values, setValues] = useState({
        name: '',
        price_quantity: 0,
        price_coin_type: '',
        image: '',
        description: ''
    })

    const navigate = useNavigate();

    const handleImageChange = (e: any) => {
        if(e.target.files && e.target.files[0])
        {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setValues({...values, image: imageUrl})
        }
    }

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        axios.post('http://localhost:8080/prize-categories', values)
        .then(res => {
            console.log(res)
            navigate('/prizes-manager')
        })
        .catch(err => console.log(err))
    }

    return isAdmin ? (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Add Prize Category</h2>
                <div>
                    <label>Name</label>
                    <input type="text" placeholder='Enter name' required onChange={e => setValues({...values, name: e.target.value})}/>
                </div>
                <div>
                    <label>Price Quantity</label>
                    <input type="number" placeholder='Enter price quantity' required onChange={e => setValues({...values, price_quantity: parseInt(e.target.value)})}/>
                </div>
                <div>
                    <label>Price Coin Type</label>
                    <input type="text" placeholder='Enter coin type' required onChange={e => setValues({...values, price_coin_type: e.target.value})}/>
                </div>
                <div>
                    <label>Image</label>
                    <input type="file" placeholder='Upload image' onChange={handleImageChange} />
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" placeholder='Enter description' onChange={e => setValues({...values, description: e.target.value})}/>
                </div>
                <button className='btn btn-success'>Submit</button>
            </form>
        </div>
    ) :
    (
        <div>
            <p>restricted page</p>
        </div>
    )
}

export default Create;