import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight, Boxes, Tag as TagIcon, Tag } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ENDPOINTS, getAuthHeader } from '../../config/apiConfig';
import TagManagement from '../../components/admin/TagManagement';
import IconPicker from '../../components/IconPicker';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { admin } = useAdminAuth();
  const { showNotification } = useNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showTagManagement, setShowTagManagement] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [tags, setTags] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    tag: 'normal',
    secret_data: '',
    image: null,
    imagePreview: null
  });

  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTagForIcon, setSelectedTagForIcon] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleClose = () => {
    setShowForm(false);
    setEditProduct(null);
    setForm({
      name: '',
      price: '',
      stock: '',
      description: '',
      tag: 'normal',
      secret_data: '',
      image: null,
      imagePreview: null
    });
  };

  const handleIconSelect = async (iconName) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/product-tags/${selectedTagForIcon.id}`,
        { icon: iconName },
        { headers: { Authorization: `Bearer ${admin.token}` }}
      );

      if (response.data.success) {
        setTags(tags.map(tag => 
          tag.id === selectedTagForIcon.id ? { ...tag, icon: iconName } : tag
        ));
        showNotification('อัพเดทไอคอนสำเร็จ', 'success');
      }
    } catch (error) {
      console.error('Error updating icon:', error);
      showNotification('ไม่สามารถอัพเดทไอคอนได้', 'error');
    }
    setShowIconPicker(false);
  };

  // เพิ่ม timeout config
  const axiosConfig = {
    timeout: 15000, // 15 วินาที
    headers: { 
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json'
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/products', {
          headers: { Authorization: `Bearer ${admin.token}` }
        });
        // Ensure we're setting an array, even if empty
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        showNotification('ไม่สามารถดึงข้อมูลสินค้าได้', 'error');
        setProducts([]); 
      }
    };
    fetchProducts();
  }, [admin.token, showNotification]);

  // เพิ่มฟังก์ชัน fetchTags
  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/product-tags', {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      if (response.data.success) {
        setTags(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      showNotification('ไม่สามารถโหลดข้อมูลแท็กได้', 'error');
    }
  };

  // แก้ไข useEffect ที่ใช้โหลดแท็ก
  useEffect(() => {
    if (admin?.token) {
      fetchTags();
    }
  }, [admin?.token, showTagManagement]); // เพิ่ม showTagManagement เป็น dependency

  useEffect(() => {
    // กรองสินค้าตาม tag ที่เลือก
    if (selectedTag === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.tag === selectedTag));
    }
  }, [selectedTag, products]);

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || '',
        price: editProduct.price || '',
        stock: editProduct.stock || '',
        description: editProduct.description || '',
        tag: editProduct.tag || 'normal',
        secret_data: editProduct.secret_data || '',
        image: null,
        imagePreview: editProduct.image || null
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setForm(prev => ({
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file)
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const fileInput = formData.get('image');
      let imageBase64 = null;

      if (fileInput instanceof File) {
        if (fileInput.size > 5 * 1024 * 1024) {
          showNotification('ขนาดไฟล์ต้องไม่เกิน 5MB', 'error');
          return;
        }
        const compressedFile = await compressImage(fileInput);
        imageBase64 = await convertToBase64(compressedFile);
      }

      const productData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        description: formData.get('description') || '',
        tag: formData.get('tag') || 'normal',
        secret_data: formData.get('secret_data') || '',
        image: imageBase64
      };

      const response = await axios.post(
        'http://localhost:3000/api/admin/products',
        productData,
        {
          headers: { 
            Authorization: `Bearer ${admin.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setProducts(prev => [...prev, response.data.product]);
        showNotification('เพิ่มสินค้าสำเร็จ', 'success');
        setShowForm(false);
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        showNotification('การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่', 'error');
      } else {
        console.error('Error adding product:', err.response?.data || err);
        showNotification(
          err.response?.data?.message || 'ไม่สามารถเพิ่มสินค้าได้', 
          'error'
        );
      }
    }
  };

  const handleEditProduct = async (formData) => {
    try {
      const fileInput = formData.get('image');
      let imageBase64 = null;

      if (fileInput instanceof File) {
        // Check file size (5MB limit)
        if (fileInput.size > 5 * 1024 * 1024) {
          showNotification('ขนาดไฟล์ต้องไม่เกิน 5MB', 'error');
          return;
        }
        // Compress and convert image
        const compressedFile = await compressImage(fileInput);
        imageBase64 = await convertToBase64(compressedFile);
      }

      const jsonData = {
        name: formData.get('name'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        description: formData.get('description') || '',
        tag: formData.get('tag') || 'normal',
        secret_data: formData.get('secret_data') || '',
        image: imageBase64 || editProduct.image
      };

      const response = await axios.put(
        `http://localhost:3000/api/admin/products/${editProduct.id}`,
        jsonData,
        {
          headers: {
            Authorization: `Bearer ${admin.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setProducts(products.map(p => 
          p.id === editProduct.id ? response.data.product : p
        ));
        showNotification('แก้ไขสินค้าสำเร็จ', 'success');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification(error.response?.data?.message || 'ไม่สามารถแก้ไขสินค้าได้', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${admin.token}` }
      });
      
      if (response.data.success) {
        setProducts(products.filter(p => p.id !== id));
        showNotification('ลบสินค้าสำเร็จ', 'success');
      } else {
        showNotification(response.data.message || 'ไม่สามารถลบสินค้าได้', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification(
        err.response?.data?.message || 'ไม่สามารถลบสินค้าได้', 
        'error'
      );
    }
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // เพิ่ม validation ก่อนส่งข้อมูล
      if (!form.name?.trim()) {
        showNotification('กรุณากรอกชื่อสินค้า', 'error');
        return;
      }

      Object.keys(form).forEach(key => {
        if (key !== 'imagePreview') {
          formData.append(key, form[key]);
        }
      });

      if (editProduct) {
        await handleEditProduct(formData);
      } else {
        await handleAddProduct(formData);
      }
      
      setShowForm(false);
      setEditProduct(null);
      // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
      setForm({
        name: '',
        price: '',
        stock: '',
        description: '',
        tag: 'normal',
        secret_data: '',
        image: null,
        imagePreview: null
      });
      showNotification('บันทึกข้อมูลสำเร็จ', 'success');
    } catch (err) {
      console.error('Error saving product:', err);
      showNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
  };

  return (
    <div className="space-y-4"> 
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Boxes className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold text-yellow-500">จัดการสินค้า</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTagManagement(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <TagIcon className="w-5 h-5" />
            จัดการแท็ก
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
            onClick={() => {
              setShowForm(true);
              setEditProduct(null);
            }}
          >
            <PlusCircle size={18} />
            เพิ่มสินค้าใหม่
          </button>
        </div>
      </div>

      {/* เพิ่ม Tag Selector */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">กรองตามแท็ก:</span>
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">ทั้งหมด</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.name}>
              {tag.display_name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">ไม่มีข้อมูลสินค้า</div>
      ) : (
        <>
          {/* Pagination Controls - Moved up and restyled */}
          <div className="flex justify-between items-center bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, filteredProducts.length)} จากทั้งหมด {filteredProducts.length} รายการ
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">หน้า {currentPage} จาก {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded flex items-center gap-1 transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>ก่อนหน้า</span>
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1.5 rounded flex items-center gap-1 transition-colors ${
                    currentPage >= totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-500'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  <span>ถัดไป</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse rounded-xl overflow-hidden shadow">
              <thead className="bg-yellow-500 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">รหัสสินค้า</th>
                  <th className="px-4 py-2 text-left">ชื่อสินค้า</th>
                  <th className="px-4 py-2">ราคา</th>
                  <th className="px-4 py-2">สต็อก</th>
                  <th className="px-4 py-2">หมวดหมู่</th>
                  <th className="px-4 py-2">สถานะ</th>
                  <th className="px-4 py-2">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
                {currentItems.map((product) => product && (
                  <tr key={product.id} className="border-b border-gray-200 dark:border-zinc-700">
                    <td className="px-4 py-3 text-sm font-mono">{product.id || '-'}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {product.image && (
                        <img 
                          src={`http://localhost:3000${product.image}`}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      {product.name || '-'}
                    </td>
                    <td className="px-4 py-3">฿{product.price || 0}</td>
                    <td className="px-4 py-3 text-center">{product.stock || 0}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowTagModal(true);
                        }}
                        className="px-2 py-1 rounded-full text-sm inline-flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          tags.find(t => t.name === product.tag)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {tags.find(t => t.name === product.tag)?.display_name || product.tag}
                        </span>
                        <TagIcon size={14} className="text-gray-500" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {product.stock > 0 ? 'พร้อมขาย' : 'สินค้าหมด'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button 
                        onClick={() => product?.id && openEditForm(product)} 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => product?.id && handleDelete(product.id)} 
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-lg shadow-2xl relative">
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {/* ชื่อสินค้า */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    ชื่อสินค้า
                    <span className="text-xs text-gray-500 ml-1">(จำเป็น)</span>
                  </label>
                  <input 
                    name="name"
                    placeholder="ชื่อสินค้า"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border rounded dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>
                
                {/* ราคาและสต็อก */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ราคา
                    <span className="text-xs text-gray-500 ml-1">(บาท)</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border rounded dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    สต็อก
                    <span className="text-xs text-gray-500 ml-1">(จำนวนที่มี)</span>
                  </label>
                  <input
                    name="stock"
                    type="number"
                    placeholder="จำนวนสินค้าในคลัง"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full p-2 text-sm border rounded dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>

                {/* รายละเอียดสินค้า */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    รายละเอียดสินค้า
                    <span className="text-xs text-gray-500 ml-1">(แสดงในหน้าสินค้า)</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="อธิบายรายละเอียดสินค้า เช่น คุณสมบัติ เงื่อนไขการใช้งาน"
                    value={form.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full p-2 text-sm border rounded dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>

                {/* ข้อมูลลับ */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    ข้อมูลลับ
                    <span className="text-xs text-gray-500 ml-1">(แสดงเฉพาะลูกค้าที่ซื้อแล้ว)</span>
                  </label>
                  <textarea
                    name="secret_data"
                    placeholder="ข้อมูลสำหรับลูกค้า เช่น&#10;Username: xxx&#10;Password: xxx&#10;หรือข้อมูลการใช้งานอื่นๆ"
                    value={form.secret_data}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 text-sm border rounded font-mono dark:bg-zinc-700 dark:border-zinc-600"
                  />
                </div>

                {/* เพิ่มส่วนอัพโหลดรูปภาพก่อนปุ่มบันทึก */}
                <div className="col-span-2 mt-4">
                  <label className="block text-sm font-medium mb-1">
                    รูปภาพสินค้า
                    <span className="text-xs text-gray-500 ml-1">(ไม่เกิน 5MB)</span>
                  </label>
                  <div className="flex items-start gap-4">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full p-2 text-sm border rounded dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    {form.imagePreview && (
                      <div className="relative">
                        <img
                          src={form.imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          onClick={() => setForm(prev => ({
                            ...prev,
                            image: null,
                            imagePreview: null
                          }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 text-sm bg-gray-300 dark:bg-zinc-600 rounded hover:bg-gray-400"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTagModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">จัดการแท็กสินค้า</h3>
            </div>
            <div className="p-4 space-y-4">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTagForIcon(tag);
                      setShowIconPicker(true);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    {tag.icon}
                  </button>
                  <span className="flex-1">{tag.display_name}</span>
                  <button
                    onClick={async () => {
                      try {
                        await axios.put(
                          `http://localhost:3000/api/admin/products/${selectedProduct.id}/tag`,
                          { tag: tag.name },
                          { headers: { Authorization: `Bearer ${admin.token}` }}
                        );
                        setProducts(products.map(p => 
                          p.id === selectedProduct.id ? { ...p, tag: tag.name } : p
                        ));
                        setShowTagModal(false);
                        showNotification('อัพเดทแท็กสำเร็จ', 'success');
                      } catch (error) {
                        showNotification('ไม่สามารถอัพเดทแท็กได้', 'error');
                      }
                    }}
                    className={`px-3 py-1 rounded ${
                      selectedProduct.tag === tag.name
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {selectedProduct.tag === tag.name ? 'เลือกอยู่' : 'เลือก'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showIconPicker && selectedTagForIcon && (
        <IconPicker
          onSelect={handleIconSelect}
          onClose={() => setShowIconPicker(false)}
        />
      )}
      {showTagManagement && (
        <TagManagement 
          onClose={() => {
            setShowTagManagement(false);
            fetchTags(); // เรียกโหลดแท็กใหม่หลังจากปิด TagManagement
          }} 
        />
      )}
    </div>
  );
}

// Helper functions for image handling
const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          }));
        }, 'image/jpeg', 0.7);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
