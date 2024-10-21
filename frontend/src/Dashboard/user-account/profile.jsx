import { useEffect, useState } from "react";  
import {useNavigate } from "react-router-dom";
import uploadImageToCloudinary from "../../utils/UploadCloudinary";
import { BASE_URL ,token} from "../../config";
import {toast} from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'

const Profile = ({user}) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading,setLoading]=useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
    gender: "",
    bloodType: "",
  });

  const navigate=useNavigate();

  useEffect(()=>{
    setFormData({name:user.name,email:user.email,photo:user.photo,gender:user.gender,bloodType:user.bloodType})
  },[user]);

  const validate = () => {
    let newErrors = {};
    
    // Name validation
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    // Email validation (though email is read-only, let's still validate)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Blood type validation
    const validBloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    if (!validBloodTypes.includes(formData.bloodType)) {
      newErrors.bloodType = "Invalid blood type.";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    // Photo validation (ensure a file is selected and its size)
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      newErrors.photo = "Image size must be less than 2MB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    
    // File size validation
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: "Image size must be less than 2MB." }));
      return;
    }

    const data = await uploadImageToCloudinary(file);
    setSelectedFile(file);
    setFormData({...formData, photo: data.url});
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Validate form before submission
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'put',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const {message} = await res.json();
      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate('/users/profile/me');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
       <form onSubmit={submitHandler}>
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Full name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus-outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="mb-5">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus-outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    aria-readonly
                    readOnly
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="mb-5">
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus-outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Blood Type"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus-outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                    required
                  />
                  {errors.bloodType && <p className="text-sm text-red-500">{errors.bloodType}</p>}
                </div>

                <div className="flex items-center justify-between mb-5">
                  <label className="text-headingColor font-bold text-[16px] leading-7 ">
                    Gender:
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>

                <div className="flex items-center gap-3 mb-5 ">
                  { formData.photo && <figure
                    className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor
                  flex items-center justify-center "
                  >
                    <img src={formData.photo} alt="" className="w-full rounded-full " />
                  </figure>}

                  <div className="relative w-[130px] h-[50px]">
                    <input
                      type="file"
                      name="photo"
                      id="customFile"
                      onChange={handleFileInputChange}
                      accept=".jpg, .png"
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <label
                      htmlFor="customFile"
                      className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                    >
                      {selectedFile ? selectedFile.name : "upload photo"}
                    </label>
                  </div>
                  {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
                </div>

                <div className="mt-7">
                  <button
                  disabled={loading && true}
                    type="submit"
                    className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
                  >
                    { loading ? <HashLoader size={25} color="#ffffff"/>:  'Update'}
                  </button>
                </div>
              </form>
    </div>
  );
}

export default Profile;
