

  export interface Product {
    "id" : string,
    "name": string,
    "quantity": number,
    "description": string,
    "codigo": string,
    "ean_code" : string | null,
    "tax": number,
    "prices": { "name": string, "price": number }[],
    "images": { "name": string, "secure_url": string }[]
    ,
  }

  export interface productToModify {
    "id" : string,
    "name": string,
    "active": "on" | "off" | undefined,
    "codigo": string | undefined,
    "description": string,
    "ean_code" : string |undefined,
    "marca": string | undefined,
    "nuevo": "on" | "off" | undefined,
    "descuento": number | undefined,
    "quantity": number | undefined,
    "tax": number,
    "price": number,
    "send_images": string
    ,
  }

  export interface categoryToModify {
    "id" : string,
    "name": string,
    "description": string | undefined,
    "parent_id" : string | undefined,
    "send_images": string
  }




  export interface ProductStore extends Product{
    qtyBuy: number
  }

  export interface usuario {
    "id": string,
    "role_id": number,
    "name": string,
    "phone": string,
    "email": string,
    "doc_type": string,
    "num_doc": string,
    "departament": string,
    "city": string,
    "address": string,
    "bussiness_unit": string | null,
    "zone_id": number,
    "asesor": string,
    "discount": number,
    "cod_vendedor": string
  }





  export interface OriginalItem {
    categoria_id: string;
    categoria_name: string;
    product_id: string;
    name: string;
    price_type: string;
    price: number;
    image_type: string;
    secure_url: string;
    row_num: bigint;
  }
  
  export interface NewItem {
    categoria_id: string;
    categoria_name: string;
    productos: Omit<OriginalItem, 'categoria_id' | 'categoria_name' | 'row_num'>[];
  }









  export interface StoreSections {
    id?:       string;
    name:       string;
    sections?:  StoreSections[];
  }

 
  





  export interface client {
    nombre          :string,
    telefono        :string,
    email           :string,
    tipoDoc         :string,
    numDoc          :string,
    Departamento    :string,
    Ciudad          :string,
    direccion       :string,
    bussinessUnit   :string,
    role:{
      name:string
    }
  }

  export interface appuser {
    id: number;
    roleId: number;
    name: string;
  }
  export interface categories{
    id: string,
    name:string
  }
