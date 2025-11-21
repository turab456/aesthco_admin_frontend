import React, { useState, cloneElement } from 'react'
import axios from "axios";
import { Table } from '../../components/ui/table'
import PageMeta from '../../components/common/PageMeta'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import ComponentCard from '../../components/common/ComponentCard'
import BasicTableOne from '../../components/tables/BasicTables/BasicTableOne'
import { Modal } from '../../components/ui/modal'
import Label from '../../components/form/Label'
import Input from '../../components/form/input/InputField'
import Button from '../../components/ui/button/Button'
import { useModal } from '../../hooks/useModal'
import FileInput from '../../components/form/input/FileInput'
import Badge from '../../components/ui/badge/Badge';

const ProductManagement = () => {

  // -------------------------------------------------------
  // PRODUCT FORM STATE
  // -------------------------------------------------------
  const [form, setForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    gender: "",
    category_id: "",
    collection_id: "",
    is_active: "",
  });

  // -------------------------------------------------------
  // VARIANTS STATE (MULTIPLE)
  // -------------------------------------------------------
  const [variants, setVariants] = useState([
    {
      color: "",
      size: "",
      sku: "",
      stock: "",
      base_price: "",
      sale_price: "",
      is_available: "",
    },
  ]);

  // -------------------------------------------------------
  // IMAGES STATE (MULTIPLE)
  // -------------------------------------------------------
  const [images, setImages] = useState([
    {
      image_url: "",
      alt_text: "",
      is_primary: "",
      file: null,
    },
  ]);

  // -------------------------------------------------------
  // SLUG GENERATOR
  // -------------------------------------------------------
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // -------------------------------------------------------
  // UNIVERSAL CHANGE HANDLER
  // -------------------------------------------------------
  const handleChange = (key: string, value: any) => {
    if (key === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  // -------------------------------------------------------
  // ENHANCE ELEMENT WITHOUT MODIFYING JSX
  // -------------------------------------------------------
  const enhanceElement = (element: any, key: string): any => {
    if (!element || typeof element !== "object") return element;

    // Input (text)
    if (element.props?.type === "text") {
      return cloneElement(element, {
        onChange: (e: any) => handleChange(key, e.target.value),
        value: form[key as keyof typeof form],
      });
    }

    // Textarea
    if (element.type === "textarea") {
      return cloneElement(element, {
        onChange: (e: any) => handleChange(key, e.target.value),
        value: form[key as keyof typeof form],
      });
    }

    // Select
    if (element.type === "select") {
      return cloneElement(element, {
        onChange: (e: any) => handleChange(key, e.target.value),
        value: form[key as keyof typeof form],
      });
    }

    // Recursive: wrapper div containing children
    if (element.props?.children) {
      return cloneElement(element, {
        children: React.Children.map(
          element.props.children,
          (child) => enhanceElement(child, key)
        ),
      });
    }

    return element;
  };

  // -------------------------------------------------------
  // FIELD MAPPING (UNCHANGED)
  // -------------------------------------------------------
  const fieldMap = [
    "name",
    "slug",
    "short_description",
    "description",
    "gender",
    "category_id",
    "collection_id",
    "is_active",
  ];

  // -------------------------------------------------------
  // MODAL LOGIC
  // -------------------------------------------------------
  const { isOpen, openModal, closeModal } = useModal();

  // -------------------------------------------------------
  // SAVE API USING AXIOS
  // -------------------------------------------------------
  const handleSave = async () => {
    try {
      const payload = {
        product: form,
        variants,
        images,
      };

      const response = await axios.post("/api/products", payload);
      console.log("Product Saved:", response.data);

      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // -------------------------------------------------------
  // TABLE DATA (STATIC DEMO)
  // -------------------------------------------------------
  const tableData = [
    {
      id: 1,
      product: {
        name: "Premium Hoodie",
        slug: "premium-hoodie",
        short_description: "Soft cotton hoodie for daily wear.",
        description: "A premium hoodie made with 100% soft cotton.",
        gender: "MEN",
        category_id: "hoodies",
        collection_id: "new-arrival",
        is_active: true,
      },

      variants: [
        {
          color: "Black",
          size: "M",
          sku: "HD-BLK-M",
          stock: 50,
          base_price: 2999,
          sale_price: 2499,
          is_available: true,
        },
        {
          color: "Black",
          size: "L",
          sku: "HD-BLK-L",
          stock: 30,
          base_price: 2999,
          sale_price: null,
          is_available: true,
        }
      ],

      images: [
        {
          image_url: "/images/products/hoodie-1.jpg",
          alt_text: "Hoodie Front View",
          is_primary: true,
          file: null,
        },
        {
          image_url: "/images/products/hoodie-2.jpg",
          alt_text: "Hoodie Back View",
          is_primary: false,
          file: null,
        }
      ]
    },

    {
      id: 2,
      product: {
        name: "Classic T-Shirt",
        slug: "classic-tshirt",
        short_description: "Comfortable cotton T-shirt.",
        description: "A classic T-shirt for everyday use.",
        gender: "UNISEX",
        category_id: "tshirt",
        collection_id: "summer",
        is_active: true,
      },

      variants: [
        {
          color: "White",
          size: "M",
          sku: "TS-WHT-M",
          stock: 80,
          base_price: 999,
          sale_price: 799,
          is_available: true,
        }
      ],

      images: [
        {
          image_url: "/images/products/tshirt-1.jpg",
          alt_text: "T-shirt Front",
          is_primary: true,
          file: null,
        }
      ]
    }
  ];


  const columns = [
    {
      key: "name",
      title: "Product Name",
      render: (item: any) => item.product.name
    },

    {
      key: "slug",
      title: "Slug",
      render: (item: any) => item.product.slug
    },

    {
      key: "short_description",
      title: "Short Description",
      render: (item: any) => item.product.short_description
    },

    {
      key: "gender",
      title: "Gender",
      render: (item: any) => item.product.gender
    },

    {
      key: "category_id",
      title: "Category",
      render: (item: any) => item.product.category_id
    },

    {
      key: "collection_id",
      title: "Collection",
      render: (item: any) => item.product.collection_id
    },

    {
      key: "variants",
      title: "Variants",
      render: (item: any) => (
        <div className="text-xs text-gray-700 dark:text-gray-300">
          {item.variants.map((v: any, i: number) => (
            <div key={i}>
              {v.color} / {v.size} — SKU: {v.sku} ({v.stock} stock)
            </div>
          ))}
        </div>
      )
    },

    {
      key: "images",
      title: "Images",
      render: (item: any) => (
        <div className="flex -space-x-2">
          {item.images.map((img: any, i: number) => (
            <img
              key={i}
              src={img.image_url}
              className="w-8 h-8 rounded-full border border-gray-300"
            />
          ))}
        </div>
      )
    },

    {
      key: "is_active",
      title: "Active",
      render: (item: any) => (
        <span
          className={`px-3 py-1 rounded-full text-xs ${item.product.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }`}
        >
          {item.product.is_active ? "Yes" : "No"}
        </span>
      ),
    },
  ];


  // -------------------------------------------------------
  // JSX RENDER
  // -------------------------------------------------------

  return (
    <>
      <PageMeta
        title="Product Management"
        description="Manage your products"
      />

      <PageBreadcrumb pageTitle="Product Management" />

      <div className="space-y-6">
        <ComponentCard
          title=""
          btn={true}
          btntext="Add Product"
          btnclick={openModal}
        >
          <BasicTableOne columns={columns} data={tableData} />
        </ComponentCard>
      </div>

      {/* ---------------------- MODAL ---------------------- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] h-full ">

        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">

          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add / Edit Product
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill product details to create or update your product listing.
            </p>
          </div>

          {/* ---------------------- FORM ---------------------- */}
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">

              {/* PRODUCT FIELDS (ENHANCED BY fieldMap) */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                {React.Children.map(
                  [
                    <div>
                      <Label>Name *</Label>
                      <Input type="text" placeholder="Enter product name" />
                    </div>,

                    <div>
                      <Label>Slug *</Label>
                      <Input type="text" placeholder="product-name-url" />
                    </div>,

                    <div className="lg:col-span-2">
                      <Label>Short Description *</Label>
                      <Input type="text" placeholder="One or two sentences about the product" />
                    </div>,

                    <div className="lg:col-span-2">
                      <Label>Description *</Label>
                      <textarea
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                        rows={4}
                        placeholder="Detailed product description"
                      ></textarea>
                    </div>,

                    <div>
                      <Label>Gender *</Label>
                      <select className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                        <option value="">Select</option>
                        <option value="MEN">MEN</option>
                        <option value="WOMEN">WOMEN</option>
                        <option value="UNISEX">UNISEX</option>
                      </select>
                    </div>,

                    <div>
                      <Label>Category ID *</Label>
                      <select className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                        <option value="">Select</option>
                        <option value="hoodies">Hoodies</option>
                        <option value="tshirt">T-Shirts</option>
                        <option value="sweatshirt">Sweatshirts</option>
                      </select>
                    </div>,

                    <div>
                      <Label>Collection ID</Label>
                      <select className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                        <option value="">Select</option>
                        <option value="new-arrival">New Arrival</option>
                        <option value="summer">Summer</option>
                        <option value="winter">Winter</option>
                      </select>
                    </div>,

                    <div>
                      <Label>Is Active *</Label>
                      <select className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>,
                  ],
                  (child, index) => enhanceElement(child, fieldMap[index])
                )}

                {/* ----------------------------------------------------
                    VARIANTS SECTION (MULTIPLE)
                ---------------------------------------------------- */}
                <div className="lg:col-span-2 pt-4">
                  <h3 className="text-lg font-semibold">Variants</h3>
                </div>

                {variants.map((v, i) => (
                  <React.Fragment key={i}>
                    <div>
                      <Label>Color *</Label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].color = e.target.value;
                          setVariants(updated);
                        }}
                      >
                        <option value="">Select Color</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                      </select>
                    </div>


                    <div>
                      <Label>Size *</Label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].size = e.target.value;
                          setVariants(updated);
                        }}
                      >
                        <option value="">Select Size</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                      </select>
                    </div>


                    <div>
                      <Label>SKU *</Label>
                      <Input
                        type="text"
                        placeholder="SKU"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].sku = e.target.value;
                          setVariants(updated);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Stock Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].stock = e.target.value;
                          setVariants(updated);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Base Price *</Label>
                      <Input
                        type="number"
                        placeholder="Base price"
                        value={v.base_price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].base_price = e.target.value;
                          setVariants(updated);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Sale Price</Label>
                      <Input
                        type="number"
                        placeholder="Sale price"
                        value={v.sale_price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].sale_price = e.target.value;
                          setVariants(updated);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Is Available *</Label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                        value={v.is_available}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].is_available = e.target.value;
                          setVariants(updated);
                        }}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>

                    <div className="flex items-center mt-6">
                      {variants.length > 1 && (
                        <Button
                          size="sm"
                          type={"button"}
                          variant="outline"
                          onClick={() =>
                            setVariants(variants.filter((_, index) => index !== i))
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                ))}

                <div className="lg:col-span-2">
                  <Button
                    size="sm"
                    type={"button"}

                    onClick={() =>
                      setVariants([
                        ...variants,
                        {
                          color: "",
                          size: "",
                          sku: "",
                          stock: "",
                          base_price: "",
                          sale_price: "",
                          is_available: "",
                        },
                      ])
                    }
                  >
                    + Add Variant
                  </Button>
                </div>

                {/* ----------------------------------------------------
                    IMAGES SECTION (MULTIPLE)
                ---------------------------------------------------- */}
                <div className="lg:col-span-2 pt-6">
                  <h3 className="text-lg font-semibold">Product Images</h3>
                </div>

                {images.map((img, i) => (
                  <React.Fragment key={i}>
                    <div className="lg:col-span-2">
                      <Label>Image URL *</Label>
                      <Input
                        type="text"
                        placeholder="Image URL"
                        value={img.image_url}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[i].image_url = e.target.value;
                          setImages(updated);
                        }}
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <Label>Alt Text</Label>
                      <Input
                        type="text"
                        placeholder="Optional alt text"
                        value={img.alt_text}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[i].alt_text = e.target.value;
                          setImages(updated);
                        }}
                      />
                    </div>

                    <div>
                      <Label>Is Primary *</Label>
                      <select
                        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                        value={img.is_primary}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[i].is_primary = e.target.value;
                          setImages(updated);
                        }}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <Label>Upload File</Label>
                      <FileInput
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          const updated = [...images];
                          updated[i].file = file;
                          setImages(updated);
                        }}
                      />
                    </div>

                    <div className="flex items-center mt-6">
                      {images.length > 1 && (
                        <Button
                          type={"button"}

                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setImages(images.filter((_, index) => index !== i))
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                ))}

                <div className="lg:col-span-2">
                  <Button
                    size="sm"
                    type={"button"}

                    onClick={() =>
                      setImages([
                        ...images,
                        {
                          image_url: "",
                          alt_text: "",
                          is_primary: "",
                          file: null,
                        },
                      ])
                    }
                  >
                    + Add Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ProductManagement;
