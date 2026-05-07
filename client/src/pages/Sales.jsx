import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import api from "../api/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [draft, setDraft] = useState({ product: "", quantity: 1 });
  const [productQuery, setProductQuery] = useState("");
  const [showProductMatches, setShowProductMatches] = useState(false);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const selectedProduct = useMemo(() => products.find((product) => product._id === draft.product), [products, draft.product]);
  const filteredProducts = useMemo(
    () => products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(productQuery.toLowerCase())).slice(0, 8),
    [products, productQuery]
  );
  const cartTotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  async function load() {
    const [productsRes, salesRes] = await Promise.all([api.get("/products?limit=100"), api.get("/sales?limit=50")]);
    setProducts(productsRes.data.data.items);
    setSales(salesRes.data.data.items);
  }
  useEffect(() => { load(); }, []);

  function addToCart(e) {
    e.preventDefault();
    if (!selectedProduct) return;
    const quantity = Number(draft.quantity || 1);
    setCart((current) => {
      const existing = current.find((item) => item.product === selectedProduct._id);
      if (existing) {
        return current.map((item) => item.product === selectedProduct._id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...current, { product: selectedProduct._id, name: selectedProduct.name, sellingPrice: selectedProduct.sellingPrice, quantity }];
    });
    setDraft({ product: "", quantity: 1 });
    setProductQuery("");
    setShowProductMatches(false);
  }

  function selectProduct(product) {
    setDraft((current) => ({ ...current, product: product._id }));
    setProductQuery(`${product.name} - Rs. ${product.sellingPrice}`);
    setShowProductMatches(false);
  }

  async function submitSale() {
    if (!cart.length) return toast.error("Add at least one product");
    try {
      await api.post("/sales", { items: cart.map((item) => ({ product: item.product, quantity: Number(item.quantity) })), paymentMethod });
      toast.success("Sale recorded");
      setCart([]);
      setPaymentMethod("cash");
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not record sale");
    }
  }

  return (
    <div className="grid gap-4">
      <section className="card grid gap-4">
        <form className="grid gap-3 md:grid-cols-[1fr_120px_160px_auto]" onSubmit={addToCart}>
          <label className="relative grid gap-1 text-sm font-bold text-navy/70">
            Product sold
            <input
              className="input"
              placeholder="Type product name, SKU, or category"
              value={productQuery}
              onChange={(e) => {
                setProductQuery(e.target.value);
                setDraft({ ...draft, product: "" });
                setShowProductMatches(true);
              }}
              onFocus={() => setShowProductMatches(true)}
              required
            />
            {showProductMatches && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-navy/10 bg-white p-1 shadow-lg">
                {filteredProducts.length ? filteredProducts.map((product) => (
                  <button
                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-cream"
                    key={product._id}
                    type="button"
                    onClick={() => selectProduct(product)}
                  >
                    <span>
                      <strong className="block">{product.name}</strong>
                      <span className="text-xs text-navy/50">{product.sku} - {product.category}</span>
                    </span>
                    <span className="font-bold">Rs. {product.sellingPrice}</span>
                  </button>
                )) : <p className="px-3 py-2 text-sm text-navy/50">No matching products</p>}
              </div>
            )}
          </label>
          <label className="grid gap-1 text-sm font-bold text-navy/70">
            Quantity
            <input className="input" type="number" min="1" value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: e.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-navy/70">
            Line total
            <div className="grid min-h-10 place-items-center rounded-lg bg-cream px-3 text-sm font-bold">
              Rs. {(selectedProduct?.sellingPrice || 0) * Number(draft.quantity || 0)}
            </div>
          </label>
          <button className="btn-secondary self-end">
            <Plus size={17} /> Add item
          </button>
        </form>

        <DataTable
          columns={["Product", "Qty", "Unit Price", "Subtotal", "Action"]}
          rows={cart}
          empty="No items added to this sale"
          renderRow={(item) => [
            item.name,
            item.quantity,
            `Rs. ${item.sellingPrice}`,
            `Rs. ${item.sellingPrice * item.quantity}`,
            <button type="button" className="text-red-600" onClick={() => setCart((current) => current.filter((row) => row.product !== item.product))}><Trash2 size={17} /></button>
          ]}
        />

        <div className="flex flex-col gap-3 rounded-lg bg-cream p-3 md:flex-row md:items-center md:justify-between">
          <label className="grid gap-1 text-sm font-bold text-navy/70 md:w-56">
            Payment method
            <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option><option value="card">Card</option><option value="digital">Digital</option>
            </select>
          </label>
          <strong className="text-2xl">Total: Rs. {cartTotal}</strong>
          <button type="button" className="btn-primary" onClick={submitSale}>Record Sale</button>
        </div>
      </section>

      <DataTable
        columns={["Invoice", "Products Sold", "Total", "Date"]}
        rows={sales}
        renderRow={(sale) => [
          <button className="font-bold underline" onClick={() => setSelectedSale(sale)}>{sale.invoiceNumber}</button>,
          sale.items.map((saleItem) => saleItem.product?.name).filter(Boolean).join(", "),
          `Rs. ${sale.totalAmount}`,
          new Date(sale.saleDate).toLocaleDateString()
        ]}
      />

      {selectedSale && (
        <Modal title={`Invoice ${selectedSale.invoiceNumber}`} onClose={() => setSelectedSale(null)}>
          <div className="grid gap-3">
            <p className="text-sm text-navy/60">{new Date(selectedSale.saleDate).toLocaleString()} - {selectedSale.paymentMethod}</p>
            <DataTable
              columns={["Product", "Qty", "Unit Price", "Subtotal"]}
              rows={selectedSale.items}
              renderRow={(saleItem) => [saleItem.product?.name || "Product", saleItem.quantity, `Rs. ${saleItem.unitPrice}`, `Rs. ${saleItem.subtotal}`]}
            />
            <div className="rounded-lg bg-cream p-3 text-right text-xl font-black">Total: Rs. {selectedSale.totalAmount}</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
