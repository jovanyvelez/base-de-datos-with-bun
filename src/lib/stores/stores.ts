import { writable } from 'svelte/store';
import type { Product1, ProductStore, appuser } from '$lib/types/Interfaces_or_types';
import { browser } from '$app/environment';


export const products = writable<Product1[]>( [] );

export const userApp = writable<appuser | null>(null);


const initCart: ProductStore[] = ( browser && JSON.parse( localStorage.getItem( "cart" ) ) ) || [];


export const cart = writable<ProductStore[]>( initCart );

cart.subscribe( (valor) => browser && (localStorage.cart = JSON.stringify(valor)));






//Componentes 

