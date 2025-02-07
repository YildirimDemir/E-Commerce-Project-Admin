"use client";
import React, { useEffect, useState } from "react";
import Style from "./products.module.css";
import PageHeader from "../ui/PageHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { IProduct } from "@/models/productModel";
import { getAllProducts } from "@/services/apiProducts";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [filters, setFilters] = useState<{ search: string; sort: string }>({
    search: "",
    sort: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getAllProducts({
          search: filters.search || "", 
          sort: filters.sort,
        });
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setTotalProducts(Array.isArray(fetchedProducts) ? fetchedProducts.length : 0);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);
  

  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: event.target.value }));
  };

  const handleSort = (field: string) => {
    setFilters((prev) => {
      let newSort = "";
      if (prev.sort === field) {
        newSort = `-${field}`;
      } else if (prev.sort === `-${field}`) {
        newSort = ""; 
      } else {
        newSort = field; 
      }
      return {
        ...prev,
        sort: newSort,
      };
    });
  };
  
  const getSortIcon = (field: string) => {
    if (filters.sort === field) return "↑"; 
    if (filters.sort === `-${field}`) return "↓"; 
    return ""; 
  };
  

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
  };

  return (
    <div className={Style.productsPage}>
      <PageHeader title="Products" />
      <div className={Style.searchBar}>
        <div className={Style.icon}>
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search by name, category, gender, or brand..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      <Link href='products/create-product' className={Style.createProductLink}>Create Product</Link>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : paginatedProducts.length > 0 ? (
        <div className={Style.productsTable}>
          <Table>
            <TableCaption>Products</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className={Style.tableHead}>Code</TableHead>
                <TableHead className={Style.tableHead}>Image</TableHead>
                <TableHead className={Style.tableHead}>Name</TableHead>
                <TableHead className={Style.tableHead}>Category</TableHead>
                <TableHead className={Style.tableHead}>Brand</TableHead>
                <TableHead className={Style.tableHead}>Gender</TableHead>
                <TableHead className={Style.tableHead}>Color</TableHead>
                <TableHead className={Style.tableHead} onClick={() => handleSort("price")}>
                  Price {getSortIcon("price")}
                </TableHead>
                <TableHead className={Style.tableHead} onClick={() => handleSort("stock")}>
                  Stock {getSortIcon("stock")}
                </TableHead>
                <TableHead className={Style.tableHead}>Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product, index) => (
                <TableRow key={product._id}  className={index % 2 === 0 ? Style.evenRow : Style.oddRow}>
                  <TableCell className={Style.tableCell}>{product.productCode}</TableCell>
                  <TableCell className={Style.tableCell}>
                    <Image src={product.mainImage} alt="" width={50} height={50} />
                  </TableCell>
                  <TableCell className={Style.tableCell}>{product.name}</TableCell>
                  <TableCell className={Style.tableCell}>{product.category}</TableCell>
                  <TableCell className={Style.tableCell}>{product.brand}</TableCell>
                  <TableCell className={Style.tableCell}>{product.gender}</TableCell>
                  <TableCell className={Style.tableCell}>{product.color}</TableCell>
                  <TableCell className={Style.tableCell}>${product.price}</TableCell>
                  <TableCell className={Style.tableCell}>{product.stock}</TableCell>
                  <TableCell className={Style.tableCell}>
                    <button onClick={() => router.push(`/products/${product._id}`)}>Manage</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className={Style.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`${Style.pageButton} ${currentPage === index + 1 ? Style.active : ""}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No product created yet.</p>
      )}
    </div>
  );
}
