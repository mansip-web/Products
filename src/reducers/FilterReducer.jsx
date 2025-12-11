export const initialFilterState = {
  search: "",
  category: "All",
  priceRange: [0, 2000],
};

export const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.payload };
    case "RESET_FILTERS":
      return initialFilterState;
    default:
      return state;
  }
};
