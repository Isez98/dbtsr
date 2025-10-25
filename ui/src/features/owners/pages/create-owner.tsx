import { useState } from "react";
import { usePostOwner } from "../../../services";
import type { IOwner } from "../../../types";

const CreateOwner = () => {
  const [formData, setFormData] = useState<IOwner>({
    name: '',
    email: '',
  })
  const { refetch } = usePostOwner(formData, false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData)
    refetch()
  }

  return (
    <>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={formData.email} onChange={handleChange} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
};

export default CreateOwner;