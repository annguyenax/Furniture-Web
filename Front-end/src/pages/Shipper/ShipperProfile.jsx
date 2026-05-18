import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getShipperProfile, updateShipperProfile, updateAvatar } from '../../redux/shipperSlice';
import { FaTruck, FaPhone, FaIdCard, FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/* =======================
   SECURITY CONSTANTS
======================= */
const VEHICLE_TYPES = ['bike', 'car', 'truck', 'van'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;
const MAX_LICENSE_PLATE_LENGTH = 20;

const ShipperProfile = () => {
  const dispatch = useDispatch();
  const { shipper, loading, error } = useSelector((state) => state.shipper);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicle_type: '',
    license_plate: '',
    phone: ''
  });
  
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    dispatch(getShipperProfile())
      .unwrap()
      .catch(() => {
        toast.error('Không thể tải thông tin shipper');
      });
  }, [dispatch]);

  useEffect(() => {
    if (shipper) {
      setFormData({
        vehicle_type: shipper.vehicle_type || '',
        license_plate: shipper.license_plate || '',
        phone: shipper.phone || ''
      });
      
      if (shipper.user?.profile_picture) {
        setPreviewUrl(shipper.user.profile_picture);
      }
    }
  }, [shipper]);

  useEffect(() => {
    if (error) {
      toast.error('Có lỗi xảy ra');
    }
  }, [error]);

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(), // Prevent leading whitespace
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Ảnh không được vượt quá 2MB');
      return;
    }

    // Cleanup old preview URL to prevent memory leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validateProfile = () => {
    // Validate vehicle type
    if (!VEHICLE_TYPES.includes(formData.vehicle_type)) {
      return 'Loại phương tiện không hợp lệ';
    }

    // Validate license plate
    const trimmedPlate = formData.license_plate.trim();
    if (!trimmedPlate) {
      return 'Biển số xe không được để trống';
    }
    if (trimmedPlate.length > MAX_LICENSE_PLATE_LENGTH) {
      return `Biển số xe không được quá ${MAX_LICENSE_PLATE_LENGTH} ký tự`;
    }

    // Note: Phone is not updated in profile update (backend only accepts vehicle_type and license_plate)
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateProfile();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      // Backend only accepts vehicle_type and license_plate, not phone
      const result = await dispatch(updateShipperProfile({
        vehicle_type: formData.vehicle_type,
        license_plate: formData.license_plate.trim()
      })).unwrap();

      if (result.success) {
        toast.success('Cập nhật thông tin thành công');
        dispatch(getShipperProfile());
        setIsEditing(false);
      } else {
        toast.error('Cập nhật thông tin thất bại');
      }
    } catch {
      toast.error('Không thể cập nhật thông tin');
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) {
      toast.error('Vui lòng chọn ảnh');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('avatar', avatar);

    try {
      const result = await dispatch(updateAvatar(formDataToSend)).unwrap();
      
      if (result.success) {
        setAvatar(null);
        toast.success('Cập nhật ảnh đại diện thành công');
        dispatch(getShipperProfile());
      } else {
        toast.error('Cập nhật ảnh đại diện thất bại');
      }
    } catch {
      toast.error('Không thể cập nhật ảnh đại diện');
    }
  };

  const getVehicleTypeText = (type) => {
    switch (type) {
      case 'bike':
        return 'Xe máy';
      case 'car':
        return 'Ô tô';
      case 'truck':
        return 'Xe tải';
      case 'van':
        return 'Xe tải nhỏ';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const renderEditMode = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img 
              src={previewUrl || shipper?.user?.profile_picture || '/default-avatar.png'} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100"
            />
            {avatar && (
              <button
                onClick={handleAvatarSubmit}
                type="button"
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Cập nhật ảnh
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại phương tiện
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Chọn loại phương tiện</option>
              <option value="bike">Xe máy</option>
              <option value="car">Ô tô</option>
              <option value="truck">Xe tải</option>
              <option value="van">Xe tải nhỏ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biển số xe
            </label>
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Số điện thoại không thể thay đổi sau khi đăng ký
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  vehicle_type: shipper.vehicle_type || '',
                  license_plate: shipper.license_plate || '',
                  phone: shipper.phone || ''
                });
              }}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderViewMode = () => {
    const userData = shipper?.user || {};
    
    return (
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex items-start space-x-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500">
            <img 
              src={userData.profile_picture || '/default-avatar.png'} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {userData.first_name} {userData.last_name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                shipper?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {shipper?.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </div>
            <p className="text-gray-600 mt-1">ID: {shipper?.shipper_id}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="text-gray-800">{userData.first_name} {userData.last_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="text-gray-800">{shipper?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin phương tiện</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaTruck className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Loại phương tiện</p>
                  <p className="text-gray-800">{getVehicleTypeText(shipper?.vehicle_type)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaIdCard className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Biển số xe</p>
                  <p className="text-gray-800">{shipper?.license_plate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            {isEditing ? renderEditMode() : renderViewMode()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperProfile;