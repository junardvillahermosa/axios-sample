import React, { useState, useEffect } from "react";
import axios from 'axios';

interface FormData {
    userId: string;
    id: string;
    title: string;
    body: string;
    rows?: number;
}

const CRUD: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        userId: "",
        id: "",
        title: "",
        body: "",
    });

    const [editID, setEditID] = useState<string | undefined>();

    const [data, setData] = useState<Array<FormData>>([]);
    const [refresh, setRefresh] = useState<number>(0);

    const { userId, id, title, body } = formData;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userId && id && title && body) {
            axios.post('https://jsonplaceholder.typicode.com/posts', formData)
                .then(res => {

                    //Set the data
                    setData([...data, res.data]);

                    //Reset the form data
                    setFormData({ userId: "", id: "", title: "", body: "" });
                })
                .catch(err => console.log(err));
        }
    };

    const handleUpdate = () => {
        if (userId && id && title && body && editID) {
            axios.put(`https://jsonplaceholder.typicode.com/posts/${editID}`, formData)
                .then(res => {

                    //Update the data
                    setData(prevData => 
                        prevData.map(item => (item.id === editID ? {...item , ...res.data}  : item))
                        );

                    //Reset the form data
                    setFormData({ userId: "", id: "", title: "", body: "" });

                    //Increment refresh to trigger the UseEffect
                    //setRefresh(refresh + 1);
                })
                .catch(err => console.log(err));
        }
    };

    const handleDelete = (deleteID: string) => {
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${deleteID}`)
            .then(res => {
                console.log('DELETED RECORD::::', res);

                //Filtering out the data after deleting
                setData(prevData => prevData.filter(item => item.id != deleteID));
            })
            .catch(err => console.log(err));
    };

    const handleEdit = (editIDNotState: string) => {
        axios.get(`https://jsonplaceholder.typicode.com/posts/${editIDNotState}`)
            .then(res => {
                setFormData(res.data);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.log(err));
    }, [refresh]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8 offset-md-2 mt-2">
                    <h4> BASIC CRUD OPERATION using AXIOS in TypeScript</h4>
                    <form onSubmit={handleSubmit}>
                    <div className="form-group">
                            <label htmlFor="userId">User Id</label>
                            <input
                                type="text"
                                className="form-control"
                                id="userId"
                                placeholder="Enter user id"
                                name="userId"
                                value={userId}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="id">Id</label>
                            <input
                                type="text"
                                className="form-control"
                                id="id"
                                placeholder="Enter id"
                                name="id"
                                value={id}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                placeholder="Enter title"
                                name="title"
                                value={title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="body">Body</label>
                            <textarea
                                className="form-control"
                                id="body"
                                rows={formData.rows}
                                placeholder="Enter body"
                                name="body"
                                value={body}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" onClick={ handleSubmit}>
                            Submit
                        </button>
                        <button type="submit" className="btn btn-primary" onClick={() => {
                            handleUpdate()
                        }}>
                            Update
                        </button>
                    </form>

                    <hr />

                    <table className="table table-striped">
                    <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userId}</td>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.body}</td>
                                    <td>
                                        <button className="btn btn-warning" onClick={() => {
                                            handleEdit(item.id)
                                            setEditID(item.id)
                                        }}>
                                            Edit
                                        </button>{" "}
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CRUD;
