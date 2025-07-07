CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL
);

CREATE TABLE bookings (
  booking_id SERIAL PRIMARY KEY,
  hotel_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  guest_name VARCHAR(100) NOT NULL,
  guest_phone_number VARCHAR(20),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  CONSTRAINT fk_bookings_event FOREIGN KEY (event_id)
    REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE rooming_lists (
  rooming_list_id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  hotel_id INTEGER NOT NULL,
  rfp_name VARCHAR(100) NOT NULL,
  cut_off_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  agreement_type VARCHAR(50) CHECK (agreement_type IN ('leisure', 'staff', 'artist')) NOT NULL,
  CONSTRAINT fk_rooming_lists_event FOREIGN KEY (event_id)
    REFERENCES events(event_id) ON DELETE CASCADE
);

CREATE TABLE rooming_list_bookings (
  rooming_list_id INTEGER NOT NULL,
  booking_id INTEGER NOT NULL,
  PRIMARY KEY (rooming_list_id, booking_id),
  CONSTRAINT fk_rlb_rooming_list FOREIGN KEY (rooming_list_id)
    REFERENCES rooming_lists(rooming_list_id) ON DELETE CASCADE,
  CONSTRAINT fk_rlb_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(booking_id) ON DELETE CASCADE
);