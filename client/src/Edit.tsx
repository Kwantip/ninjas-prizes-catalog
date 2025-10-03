import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { adminModeSetter } from "./App";
import { PrizeCategory } from './data';

function Edit() {
    const { isAdmin } = adminModeSetter();
    const [data, setData] = useState<PrizeCategory[]>([]);

    const { id } = useParams();
    useEffect(() => {
        axios.get(`http://localhost:8080/prize-categories/${id}`)
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => console.log(err));
    }, [id]);

    const navigate = useNavigate();

    const handleImageChange = (e: any) => {
        if(e.target.files && e.target.files[0])
        {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setData([{...data[0], image: imageUrl}])
        }
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        axios.put(`http://localhost:8080/prize-categories/${id}`, data[0])
        .then(res => {
            console.log(res)
            navigate('/prizes-manager')
        })
        .catch(err => console.log(err))
    }

    return isAdmin ? (
        <div>
            <h2>Edit Prize Category {`${id}`}</h2>
                <div className="btns-area">
                    <Link to="/prizes-manager">Back</Link>
                </div>
            {data.map((category) => {
                    return (
            <form onSubmit={handleSubmit} key={category.id}>
                <div>
                    <div>
                        <label>Name</label>
                        <input type="string" value={category.name} placeholder='Enter name' required onChange={(e) => setData([{...data[0], name: e.target.value}])}/>
                    </div>
                    <div>
                        <label>Price Quantity</label>
                        <input type="number" value={category.price_quantity} placeholder='Enter price quantity' required onChange={e => setData([{...data[0], price_quantity: parseInt(e.target.value)}])}/>
                    </div>
                    <div>
                        <label>Price Coin Type</label>
                        <input type="text" value={category.price_coin_type} placeholder='Enter coin type' required onChange={e => setData([{...data[0], price_coin_type: e.target.value}])}/>
                    </div>
                    {/* <div>
                        <label>Image</label>
                        <input type="file" value={category.image} placeholder='Upload image' onChange={handleImageChange} />
                    </div> */}
                    <div>
                        <label>Description</label>
                        <input type="text" value={category.description} placeholder='Enter description' onChange={e => setData([{...data[0], description: e.target.value}])}/>
                    </div>
                </div>
                
                <button className='btn btn-success'>Submit</button>
            </form>
            )})}
        </div>
    ) :
    (
        <div>
            <p>restricted page</p>
        </div>
    )
}

export default Edit;