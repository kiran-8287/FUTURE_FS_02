/**
 * Formats a number as Indian currency (₹) with Indian numbering system
 * Uses lakhs and crores instead of millions and billions
 * Example: 1,00,000 (1 lakh), 10,00,000 (10 lakhs), 1,00,00,000 (1 crore)
 */
export const formatIndianCurrency = (value: number, options?: { compact?: boolean }): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '₹0';
    }

    // For compact display (used in cards)
    if (options?.compact) {
        if (value >= 10000000) { // 1 crore or more
            return `₹${(value / 10000000).toFixed(1)}Cr`;
        } else if (value >= 100000) { // 1 lakh or more
            return `₹${(value / 100000).toFixed(1)}L`;
        } else if (value >= 1000) { // 1 thousand or more
            return `₹${(value / 1000).toFixed(1)}K`;
        }
        return `₹${value}`;
    }

    // Standard Indian number format with proper comma placement
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value);
};

/**
 * Formats a number with Indian numbering system (without currency symbol)
 * Useful for displaying plain numbers with lakhs/crores formatting
 */
export const formatIndianNumber = (value: number): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }

    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(value);
};
