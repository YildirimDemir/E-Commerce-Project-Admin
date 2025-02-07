'use client';
import React, { useEffect, useState } from 'react'
import Style from './singleproduct.module.css'
import PageHeader from '../ui/PageHeader';
import { IProduct } from '@/models/productModel';
import { useParams, useRouter } from 'next/navigation';
import { deleteProductById, getProductById, updateProductById } from '@/services/apiProducts';
import Image from 'next/image';
import DefaultImage from '../../../public/images/nova-logo-dark.png'
import PageLoader from '../ui/PageLoader';
import toast, { LoaderIcon } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { UploadButton } from '@/lib/uploadthing';

export default function SingleProduct() {
    const router = useRouter();
    const { productId } = useParams() as { productId: string };
    const [product, setProduct] = useState<IProduct>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<IProduct | null>(null);
    const [imagesUrl, setImagesUrl] = useState<string[]>([]);
    const [mainImageUrl, setMainImageUrl] = useState<string | undefined>(undefined);
    const [imageUrlDeleting, setImageUrlDeleting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const [sizes, setSizes] = useState<string[]>([]);
    const [pendingImageDeletions, setPendingImageDeletions] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);

    const categories = ['sneaker', 'running', 'football', 'basketball', 'slipper'];
    const brands = ['nike', 'adidas', 'puma', 'under armour', 'new balance'];
    const colors = ['red', 'blue', 'black', 'white', 'gray', 'green', 'yellow'];
    const genders = ['men', 'women', 'kid'];
    const availableSizes = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];  

    useEffect(() => {
        const fetchData = async () => {
             try {
                  setLoading(true);
                  const fetchedProduct = await getProductById(productId);
                  setProduct(fetchedProduct);
                  setFormValues(fetchedProduct);
                  setMainImageUrl(fetchedProduct.mainImage); 
                  setImagesUrl(fetchedProduct.images);
             } catch (err) {
                  setError((err as Error).message);
              } finally {
                 setLoading(false);
             }
        };

        if (productId) {
             fetchData();
        }
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedValues = { ...formValues, [name]: value } as IProduct;
        setFormValues(updatedValues);
        setIsUpdated(JSON.stringify(updatedValues) !== JSON.stringify(product));
    };  

    const handleImageDelete = (imageUrl: string) => {
        setPendingImageDeletions((prev) => [...prev, imageUrl]);
        setImagesUrl((prev) => prev.filter((img) => img !== imageUrl));
        setIsUpdated(true);
    };
    
  
  

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValues || !productId) return;
    
        try {

            const updatedProduct = {
                ...formValues,
                mainImage: previewImage || formValues.mainImage,
                images: imagesUrl.concat(newImages).filter(img => !pendingImageDeletions.includes(img))
            };
    
            await updateProductById(productId, updatedProduct);
            toast.success('Item updated successfully');
            setIsUpdated(false);

            await Promise.all(
                pendingImageDeletions.map(async (imageUrl) => {
                    const imageKey = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                    await fetch('/api/uploadthing/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageKey }),
                    });
                })
            );

            setPendingImageDeletions([]);
    
        } catch (error) {
            toast.error('Failed to update item');
        }
    };
    

    const handleDeleteProduct = async (productId: string) => {
        try {
          await deleteProductById(productId);
          toast.success('Item deleted successfully');
          router.push('/products')
        } catch (error) {
          alert((error as Error).message || 'Failed to delete item');
        }
    }

    const handleSizeChange = (size: number) => {
        const sizeString = size.toString();
        setSizes((prevSizes) =>
          prevSizes.includes(sizeString) ? prevSizes.filter((s) => s !== sizeString) : [...prevSizes, sizeString]
        );
    };

    if (loading) return <PageLoader />;
    if (error) return <p>Error: {error}</p>;

  return (
    <div className={Style.singleProductPage}>
        <PageHeader title='Product Detail'/>
        <div className={Style.productDetail}>
        <form onSubmit={handleSubmit}>
        <div className={Style.mainImage}>
            {previewImage ? (
                <Image src={previewImage} alt="Preview Image" width={250} height={250} />
            ) : mainImageUrl ? (
                <Image src={mainImageUrl} alt="Main Product Image" width={250} height={250} />
            ) : (
                <p>No main image</p>
            )}

            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    setPreviewImage(res[0].url); 
                    setIsUpdated(true);
                }}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                    button: {
                        backgroundColor: 'var(--green)',
                        color: '#000',
                        fontWeight: 'bold',
                        width: 95,
                        fontSize: 14
                    }
                }}
            />
        </div>


        <div className={Style.productImages}>
         <div className={Style.imagesSection}>
         {imagesUrl.map((img, index) => (
            <div key={index} className={Style.imageItem}>
                <Image src={img} alt={`Product Image ${index + 1}`} width={100} height={100} />
                <button 
                    onClick={() => handleImageDelete(img)}
                    type="button" 
                    className={Style.deleteImageBtn}
                >
                    <FaTimes />
                </button>
            </div>
        ))}
         </div>
         <div className={Style.imgUpload}>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
                const uploadedUrl = res[0].url;
                setNewImages((prev) => [...prev, uploadedUrl]);
                setImagesUrl((prev) => [...prev, uploadedUrl]); 
                setIsUpdated(true);
            }}
            onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
            appearance={{
                button: {
                    backgroundColor: 'var(--green)',
                    color: '#000',
                    fontWeight: 'bold',
                    width: 95,
                    fontSize: 14
                }
            }}
          />
         </div>
        </div>
        <div className={Style.infoBox}>
            <label>Code</label>
            <input type="text" name='productCode' value={formValues?.productCode || ''} onChange={handleChange} required placeholder='Product Code...'/>
        </div>
        <div className={Style.infoBox}>
            <label>Name</label>
            <input type="text" name='name' value={formValues?.name || ''} onChange={handleChange} required placeholder="Product Name..." />
        </div>
        <div className={Style.infoBox}>
            <label>Price</label>
            <input type="number" name='price' value={formValues?.price || ''} onChange={handleChange} required placeholder="Product Price($)..."/>
        </div>
        <div className={Style.infoBox}>
            <label>Stock</label>
            <input type="number" name='stock' value={formValues?.stock || ''} onChange={handleChange} required placeholder="Product Stock Count..."/>
        </div>
        <div className={Style.infoBox}>
            <label>Category</label>
            <select name="category" value={formValues?.category || ''} onChange={handleChange}>
                {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
        <div className={Style.infoBox}>
        <label>Brand</label>
            <select name="brand" value={formValues?.brand || ''} onChange={handleChange}>
                {brands.map((br) => (
                <option key={br} value={br}>{br}</option>
                ))}
            </select>
        </div>
        <div className={Style.infoBox}>
        <label>Color</label>
            <select name="color" value={formValues?.color || ''} onChange={handleChange}>
                {colors.map((col) => (
                <option key={col} value={col}>{col}</option>
                ))}
            </select>
        </div>
        <div className={Style.infoBox}>
            <label>Genders</label>
            <select name="gender" value={formValues?.gender || ''} onChange={handleChange}>
                {genders.map((gen) => (
                <option key={gen} value={gen}>{gen}</option>
                ))}
            </select>
        </div>
        <div className={Style.productSizes}>
            {availableSizes.map((size) => (
            <label key={size}>
                <input
                name='size'
                type='checkbox'
                value={size}
                checked={formValues?.sizes?.includes(size) || false} 
                onChange={() => handleSizeChange(size)} 
                />
                {size}
            </label>
            ))}
        </div>
        <button type="submit" className={`${Style.submitBtn} ${isUpdated ? Style.updated : ''}`} disabled={!isUpdated}>
           Update Item
        </button>
        </form>
        </div>
        </div>
  )
  }