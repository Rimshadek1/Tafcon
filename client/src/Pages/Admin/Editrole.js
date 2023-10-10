import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
function Editrole() {
    const { id } = useParams();
    const [values, setValues] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`http://localhost:3001/edituser/${id}`).then((res) => {
            console.log(res.data);
            setValues(res.data.user);
        });
    }, [id]);
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:3001/edituser/${id}`, values)
            .then((res) => {
                if (res.data.status === 'updated') {
                    navigate('/empinfo')
                } else {
                    alert('not updated')
                }
            });
    }

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <form onSubmit={handleSubmit}>
                        <legend>You can Assign role of {values?.name || ''}  now!!!!</legend>

                        <div className="form-group mt-2">
                            <label htmlFor="Location">Role</label>
                            <select
                                className="form-control"
                                name="role"
                                id="role"
                                value={values?.role || ""}
                                onChange={e => setValues({ ...values, role: e.target.value })}
                            >
                                <option value="">Select Role</option>
                                <option value="class-A">Class A</option>
                                <option value="class-B">Class B</option>
                                <option value="class-C">Class C</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="main-boy">Main Boy</option>
                                <option value="captain">Captain</option>
                                <option value="user">User</option>
                            </select>
                        </div>



                        <button type="submit" className="btn btn-primary mt-2">
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Editrole