import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Seat {
  id: number;
  status: 'available' | 'selected' | 'booked';
}

@Component({
  selector: 'app-seat',
  standalone: false,
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.css'],
})
export class SeatComponent implements OnInit {
  @Output() seatSelected = new EventEmitter<number[]>();

  seats: Seat[] = [];

  // Top L Shape rows
  topRows: any[] = [];

  // Bottom section rows
  bottomRow1: Seat[] = [];
  bottomRight1: Seat[] = [];
  bottomRow2Left: Seat[] = [];
  bottomRow2Right: Seat[] = [];
  shifttime: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    let fullshit =JSON.parse(sessionStorage.getItem('saved_shift')||"")
     this.shifttime =fullshit.shiftTime
    this.generateSeats();
    this.makeLayout();
    this.loadBookedSeats(); // ✅ ADD
  }

  // -----------------------------
  // CREATE ALL SEATS
  // -----------------------------
  generateSeats() {
    for (let i = 1; i <= 69; i++) {
      this.seats.push({ id: i, status: 'available' });
    }
  }

  // -----------------------------
  // FETCH BOOKED SEATS FROM API
  // -----------------------------
  loadBookedSeats() {

    this.http
      .get<any>(`https://api.foujibookgardenlibrary.com/api/payments/seats/status?shift=${encodeURIComponent(this.shifttime)}`)
 // 🔁 your API
      .subscribe((res) => {
        if (!res?.seats) return;

        // reset
        this.seats.forEach(s => s.status = 'available');

        // mark booked
        res.seats.forEach((b: any) => {
          if (b.status === 'booked') {
            const seat = this.seats.find(s => s.id === b.seatNo);
            if (seat) {
              seat.status = 'booked';
            }
          }
        });
      });
  }

  // -----------------------------
  // LAYOUT (UNCHANGED)
  // -----------------------------
  makeLayout() {
    this.topRows = [
      { empty: 3, left: [], right: [this.s(21)] },
      { empty: 3, left: [], right: [this.s(22)] },
      { empty: 2, left: [this.s(39)], right: [this.s(23)] },
      { empty: 2, left: [this.s(40)], right: [this.s(24)] },
      { empty: 2, left: [this.s(41)], right: [this.s(25)] },
      { empty: 0, left: [this.s(44), this.s(43), this.s(42)], right: [this.s(26)] },
      { empty: 3, left: [], right: [this.s(27)] },
      { empty: 0, left: [this.s(45), this.s(46), this.s(47)], right: [this.s(28)] },
      { empty: 0, left: [this.s(50), this.s(49), this.s(48)], right: [this.s(29)] },
      { empty: 3, left: [], right: [this.s(30)] },
      { empty: 0, left: [this.s(51), this.s(52), this.s(53)], right: [this.s(31)] },
      { empty: 0, left: [this.s(56), this.s(55), this.s(54)], right: [this.s(32)] },
      { empty: 3, left: [], right: [this.s(33)] },
      { empty: 0, left: [this.s(57), this.s(58), this.s(59)], right: [this.s(34)] },
      { empty: 0, left: [this.s(62), this.s(61), this.s(60)], right: [this.s(35)] },
      { empty: 3, left: [], right: [this.s(36)] },
      { empty: 0, left: [this.s(63), this.s(64), this.s(65)], right: [this.s(37)] },
      { empty: 0, left: [this.s(68), this.s(67), this.s(66)], right: [this.s(38)] },
    ].map((row) => ({
      empty: Array(row.empty).fill(0),
      left: row.left,
      right: row.right,
    }));

    this.bottomRow1 = [this.s(9), this.s(8), this.s(7), this.s(6), this.s(5), this.s(4), this.s(3), this.s(2), this.s(1)];
    this.bottomRight1 = [this.s(18), this.s(19), this.s(20)];

    this.bottomRow2Left = [this.s(17), this.s(16), this.s(15), this.s(14)];
    this.bottomRow2Right = [this.s(13), this.s(12), this.s(11), this.s(10)];
  }

  // -----------------------------
  s(id: number): Seat {
    return this.seats.find((x) => x.id === id)!;
  }

  // -----------------------------
  toggleSeat(seat: Seat) {
    if (seat.status === 'booked') return;

    this.seats.forEach((s) => {
      if (s.status === 'selected') s.status = 'available';
    });

    seat.status = 'selected';
    this.emitSelectedSeats();
  }

  emitSelectedSeats() {
    const selected = this.seats
      .filter((s) => s.status === 'selected')
      .map((s) => s.id);

    this.seatSelected.emit(selected);
  }

  // -----------------------------
  getSeatClass(seat: Seat) {
    return {
      'bg-gray-300 text-gray-800 hover:bg-gray-400 cursor-pointer': seat.status === 'available',
      'bg-[#16a34a] text-white': seat.status === 'selected',
      'bg-red-500 text-white cursor-not-allowed': seat.status === 'booked',
    };
  }
}
