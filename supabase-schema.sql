-- =============================================
-- Supabase Schema for Receipt App
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Create the receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id            BIGSERIAL PRIMARY KEY,
  receipt_time  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  vendor_name   TEXT NOT NULL DEFAULT '',
  receipt_no    TEXT NOT NULL DEFAULT '',
  subtotal      NUMERIC(12,2) NOT NULL DEFAULT 0,
  gst_hst       NUMERIC(12,2) NOT NULL DEFAULT 0,
  pst_qst       NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax           NUMERIC(12,2) NOT NULL DEFAULT 0,
  total         NUMERIC(12,2) NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'exported')),
  payment       TEXT NOT NULL DEFAULT '',
  chart_of_acct TEXT NOT NULL DEFAULT '',
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (allow all for now)
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON receipts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. Insert 45 sample records
INSERT INTO receipts (receipt_time, vendor_name, receipt_no, subtotal, gst_hst, pst_qst, tax, total, status, payment, chart_of_acct) VALUES
  ('2025-11-24 09:15:00+00', 'Costco Wholesale',     'REC-2025-001', 125.40, 6.27, 0.00, 6.27, 131.67, 'verified', 'Credit Card', 'Office Supplies'),
  ('2025-11-25 14:30:00+00', 'Staples Canada',        'REC-2025-002',  89.99, 4.50, 7.20, 11.70, 101.69, 'verified', 'Debit Card',  'Office Supplies'),
  ('2025-11-27 11:00:00+00', 'Shell Gas Station',     'REC-2025-003',  65.00, 3.25, 5.20, 8.45,  73.45, 'pending',  'Credit Card', 'Vehicle Expenses'),
  ('2025-11-28 16:45:00+00', 'Amazon.ca',             'REC-2025-004', 214.50, 10.73, 0.00, 10.73, 225.23, 'verified', 'Credit Card', 'Office Equipment'),
  ('2025-12-01 08:20:00+00', 'Tim Hortons',           'REC-2025-005',  12.45, 0.62, 1.00, 1.62,  14.07, 'pending',  'Cash',        'Meals & Entertainment'),
  ('2025-12-02 10:10:00+00', 'Best Buy Canada',       'REC-2025-006', 549.99, 27.50, 44.00, 71.50, 621.49, 'exported', 'Credit Card', 'Office Equipment'),
  ('2025-12-03 13:55:00+00', 'Uber Eats',             'REC-2025-007',  35.80, 1.79, 2.86, 4.65,  40.45, 'pending',  'Credit Card', 'Meals & Entertainment'),
  ('2025-12-04 09:30:00+00', 'Petro-Canada',          'REC-2025-008',  72.30, 3.62, 5.78, 9.40,  81.70, 'verified', 'Debit Card',  'Vehicle Expenses'),
  ('2025-12-05 15:20:00+00', 'Walmart Canada',        'REC-2025-009', 156.78, 7.84, 12.54, 20.38, 177.16, 'verified', 'Credit Card', 'Office Supplies'),
  ('2025-12-06 12:00:00+00', 'Canadian Tire',         'REC-2025-010',  43.25, 2.16, 3.46, 5.62,  48.87, 'pending',  'Cash',        'Maintenance & Repairs'),
  ('2025-12-08 10:45:00+00', 'Starbucks',             'REC-2025-011',   8.75, 0.44, 0.70, 1.14,   9.89, 'pending',  'Credit Card', 'Meals & Entertainment'),
  ('2025-12-09 14:15:00+00', 'Home Depot',            'REC-2025-012', 287.60, 14.38, 23.01, 37.39, 324.99, 'exported', 'Credit Card', 'Maintenance & Repairs'),
  ('2025-12-10 09:00:00+00', 'Rogers Communications', 'REC-2025-013',  85.00, 4.25, 6.80, 11.05,  96.05, 'verified', 'Auto-pay',    'Telephone & Internet'),
  ('2025-12-11 11:30:00+00', 'FedEx Canada',          'REC-2025-014',  24.50, 1.23, 1.96, 3.19,  27.69, 'pending',  'Credit Card', 'Shipping & Delivery'),
  ('2025-12-12 16:00:00+00', 'Loblaws',               'REC-2025-015',  67.90, 3.40, 5.43, 8.83,  76.73, 'verified', 'Debit Card',  'Office Supplies'),
  ('2025-12-15 08:45:00+00', 'Esso',                  'REC-2025-016',  58.20, 2.91, 4.66, 7.57,  65.77, 'pending',  'Credit Card', 'Vehicle Expenses'),
  ('2025-12-16 13:20:00+00', 'Microsoft Canada',      'REC-2025-017', 169.99, 8.50, 13.60, 22.10, 192.09, 'exported', 'Credit Card', 'Software & Subscriptions'),
  ('2025-12-17 10:00:00+00', 'Purolator',             'REC-2025-018',  18.75, 0.94, 1.50, 2.44,  21.19, 'verified', 'Credit Card', 'Shipping & Delivery'),
  ('2025-12-18 15:30:00+00', 'Subway',                'REC-2025-019',  15.20, 0.76, 1.22, 1.98,  17.18, 'pending',  'Cash',        'Meals & Entertainment'),
  ('2025-12-19 09:10:00+00', 'Bell Canada',           'REC-2025-020',  95.00, 4.75, 7.60, 12.35, 107.35, 'verified', 'Auto-pay',    'Telephone & Internet'),
  ('2025-12-22 11:45:00+00', 'IKEA Canada',           'REC-2025-021', 432.00, 21.60, 34.56, 56.16, 488.16, 'exported', 'Credit Card', 'Office Equipment'),
  ('2025-12-23 14:00:00+00', 'Dollarama',             'REC-2025-022',  22.50, 1.13, 1.80, 2.93,  25.43, 'pending',  'Cash',        'Office Supplies'),
  ('2025-12-24 10:30:00+00', 'London Drugs',          'REC-2025-023',  76.80, 3.84, 6.14, 9.98,  86.78, 'verified', 'Debit Card',  'Office Supplies'),
  ('2025-12-27 09:00:00+00', 'Telus',                 'REC-2025-024',  78.00, 3.90, 6.24, 10.14,  88.14, 'verified', 'Auto-pay',    'Telephone & Internet'),
  ('2025-12-29 13:15:00+00', 'McDonalds',             'REC-2025-025',  11.30, 0.57, 0.90, 1.47,  12.77, 'pending',  'Cash',        'Meals & Entertainment'),
  ('2026-01-02 08:30:00+00', 'Shoppers Drug Mart',    'REC-2026-001',  34.60, 1.73, 2.77, 4.50,  39.10, 'pending',  'Credit Card', 'Office Supplies'),
  ('2026-01-03 12:20:00+00', 'Esso',                  'REC-2026-002',  61.40, 3.07, 4.91, 7.98,  69.38, 'verified', 'Credit Card', 'Vehicle Expenses'),
  ('2026-01-06 10:00:00+00', 'Canva',                 'REC-2026-003',  16.99, 0.85, 1.36, 2.21,  19.20, 'exported', 'Credit Card', 'Software & Subscriptions'),
  ('2026-01-07 15:45:00+00', 'Metro',                 'REC-2026-004',  48.90, 2.45, 3.91, 6.36,  55.26, 'verified', 'Debit Card',  'Office Supplies'),
  ('2026-01-08 09:20:00+00', 'Canada Post',           'REC-2026-005',  15.40, 0.77, 1.23, 2.00,  17.40, 'pending',  'Cash',        'Shipping & Delivery'),
  ('2026-01-10 11:00:00+00', 'Zoom Video',            'REC-2026-006',  21.99, 1.10, 1.76, 2.86,  24.85, 'verified', 'Credit Card', 'Software & Subscriptions'),
  ('2026-01-12 14:30:00+00', 'Costco Wholesale',      'REC-2026-007', 198.50, 9.93, 15.88, 25.81, 224.31, 'verified', 'Credit Card', 'Office Supplies'),
  ('2026-01-14 08:15:00+00', 'Shell Gas Station',     'REC-2026-008',  70.10, 3.51, 5.61, 9.12,  79.22, 'pending',  'Credit Card', 'Vehicle Expenses'),
  ('2026-01-15 16:00:00+00', 'A&W',                   'REC-2026-009',  13.50, 0.68, 1.08, 1.76,  15.26, 'pending',  'Cash',        'Meals & Entertainment'),
  ('2026-01-17 10:30:00+00', 'Staples Canada',        'REC-2026-010', 112.30, 5.62, 8.98, 14.60, 126.90, 'exported', 'Credit Card', 'Office Supplies'),
  ('2026-01-20 13:00:00+00', 'Adobe Inc.',            'REC-2026-011',  69.99, 3.50, 5.60, 9.10,  79.09, 'verified', 'Credit Card', 'Software & Subscriptions'),
  ('2026-01-22 09:45:00+00', 'Petro-Canada',          'REC-2026-012',  55.80, 2.79, 4.46, 7.25,  63.05, 'pending',  'Debit Card',  'Vehicle Expenses'),
  ('2026-01-24 11:20:00+00', 'Tim Hortons',           'REC-2026-013',   9.85, 0.49, 0.79, 1.28,  11.13, 'pending',  'Cash',        'Meals & Entertainment'),
  ('2026-01-27 14:50:00+00', 'Amazon.ca',             'REC-2026-014', 324.00, 16.20, 25.92, 42.12, 366.12, 'verified', 'Credit Card', 'Office Equipment'),
  ('2026-01-29 08:00:00+00', 'Rogers Communications', 'REC-2026-015',  85.00, 4.25, 6.80, 11.05,  96.05, 'verified', 'Auto-pay',    'Telephone & Internet'),
  ('2026-02-01 10:15:00+00', 'Best Buy Canada',       'REC-2026-016', 199.99, 10.00, 16.00, 26.00, 225.99, 'exported', 'Credit Card', 'Office Equipment'),
  ('2026-02-03 12:40:00+00', 'Uber Eats',             'REC-2026-017',  28.60, 1.43, 2.29, 3.72,  32.32, 'pending',  'Credit Card', 'Meals & Entertainment'),
  ('2026-02-05 09:30:00+00', 'Canadian Tire',         'REC-2026-018',  67.40, 3.37, 5.39, 8.76,  76.16, 'verified', 'Credit Card', 'Maintenance & Repairs'),
  ('2026-02-10 15:00:00+00', 'Home Depot',            'REC-2026-019', 145.20, 7.26, 11.62, 18.88, 164.08, 'pending',  'Credit Card', 'Maintenance & Repairs'),
  ('2026-02-15 11:30:00+00', 'FedEx Canada',          'REC-2026-020',  32.00, 1.60, 2.56, 4.16,  36.16, 'verified', 'Credit Card', 'Shipping & Delivery');
