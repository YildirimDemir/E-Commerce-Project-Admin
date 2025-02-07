'use client';
import React, { useState } from 'react';
import Style from './createproduct.module.css';
import PageHeader from '../ui/PageHeader';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { createProduct } from '@/services/apiProducts';
import toast from 'react-hot-toast';

export default function CreateProduct() {
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [gender, setGender] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const categories = ['sneaker', 'running', 'football', 'basketball', 'slipper'];
  const brands = ['nike', 'adidas', 'puma', 'under armour', 'new balance'];
  const colors = ['red', 'blue', 'black', 'white', 'gray', 'green', 'yellow'];
  const genders = ['men', 'women', 'kid'];
  const availableSizes = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

  const handleSizeChange = (size: number) => {
    const sizeString = size.toString();
    setSizes((prevSizes) =>
      prevSizes.includes(sizeString) ? prevSizes.filter((s) => s !== sizeString) : [...prevSizes, sizeString]
    );
  };

  const handleCreateProduct = async () => {
    try {
      const newProduct = {
        name: productName,
        productCode,
        category,
        mainImage,
        images,
        price,
        sizes,
        color,
        brand,
        stock,
        inStock: stock > 0,
        gender,
      };
      
      await createProduct(newProduct);
      alert('Product created successfully!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <div className={Style.createProductPage}>
      <PageHeader title='Create Product' />
      <div className={Style.createProductForm}>
        
        <div className={Style.productMainImage}>
          {mainImage ? (
            <Image src={mainImage} alt='Main Product' width={200} height={200} className={Style.mainImage}/>
          ) : (
            <div className={Style.imagePlaceholder}>
              <p>Add Main Image</p>
            </div>
          )}
          <UploadButton
            endpoint='imageUploader'
            onClientUploadComplete={(res) => {
              setMainImage(res[0].url)
              toast.success('Upload Success')
            }}
            onUploadError={(error: Error) => {
              toast.error(`Error! ${error.message}`)
            }}
          />
        </div>
        
        <div className={Style.productImages}>
          {images.length === 0 ? (
            <>
            <div className={Style.addImages}>
            <p>Select your product images</p>
            {/* <UploadButton
            endpoint='imageUploader'
            onClientUploadComplete={(res) => setImages([...images, res[0].url])}
            /> */}
            </div>
          </>
          ) : (
            images.map((img, index) => (
              <>
              <Image key={index} src={img} className={Style.images} alt={`Product Image ${index}`} width={100} height={100} />
              </>
            ))
          )}
              <UploadButton
              endpoint='imageUploader'
              onClientUploadComplete={(res) => setImages([...images, res[0].url])}
              />
        </div>
        
        <div className={Style.productInfo}>
          <input
            type='text'
            placeholder='Enter product code...'
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
          <input
            type='text'
            placeholder='Enter product name...'
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type='number'
            placeholder={price === 0 ? 'Enter price ($)...' : ''}
            value={price === 0 ? '' : price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <input
            type='number'
            placeholder={stock === 0 ? 'Enter stock count...' : ''}
            value={stock === 0 ? '' : stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>
        
        {/* Product Details */}
        <div className={Style.productDetail}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value=''>Select Brand</option>
            {brands.map((br) => (
              <option key={br} value={br}>{br}</option>
            ))}
          </select>
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value=''>Select Color</option>
            {colors.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value=''>Select Gender</option>
            {genders.map((gen) => (
              <option key={gen} value={gen}>{gen}</option>
            ))}
          </select>
        </div>
        
        <div className={Style.productSizes}>
          {availableSizes.map((size) => (
            <label key={size}>
              <input
                type='checkbox'
                value={size}
                checked={sizes.includes(size.toString())}
                onChange={() => handleSizeChange(size)}
              />
              {size}
            </label>
          ))}
        </div>
        
        <button className={Style.createBtn} onClick={handleCreateProduct}>Create</button>
      </div>
    </div>
  );
}