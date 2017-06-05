/* eslint-disable no-undef */
export const get = (sel, el = document) => el.querySelector(sel);
export const getAll = (sel, el = document) => el.querySelectorAll(sel);

export const add = (el, eve, cb) => el.addEventListener(eve, cb);
export const addEach = (el, eve, cb) => el.forEach(i => i.addEventListener(eve, cb));
