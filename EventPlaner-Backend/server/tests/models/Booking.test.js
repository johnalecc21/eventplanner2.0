import mongoose from 'mongoose';
import Booking from '../../models/Booking.js';
import User from '../../models/User.js';
import Service from '../../models/Service.js';

// Configuración de conexión a la base de datos de prueba
const TEST_DB_URI = 'mongodb://localhost:27017/event-planner-test';

// Configuración inicial
beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

// Limpieza final
afterAll(async () => {
  await Booking.deleteMany({});
  await User.deleteMany({});
  await Service.deleteMany({});
  await mongoose.connection.close();
});

// Limpieza antes de cada prueba
beforeEach(async () => {
  await Booking.deleteMany({});
  await User.deleteMany({});
  await Service.deleteMany({});
});

describe('Booking Model Tests', () => {
  // Creamos datos de referencia para usar en las pruebas
  let user, provider, service;

  beforeEach(async () => {
    // Crear usuarios para las pruebas
    user = new User({
      name: 'Cliente Test',
      email: 'cliente@test.com',
      password: 'password123'
    });
    await user.save();

    provider = new User({
      name: 'Proveedor Test',
      email: 'proveedor@test.com',
      password: 'password123'
    });
    await provider.save();

    // Crear un servicio para las pruebas
    service = new Service({
      provider: provider._id,
      name: 'Servicio Test',
      category: 'Categoría Test',
      description: 'Descripción del servicio para pruebas',
      price: 100,
      images: ['test.jpg'],
      location: 'Ubicación Test'
    });
    await service.save();
  });

  test('debería rechazar una reserva sin campos requeridos', async () => {
    // Sin serviceId
    const bookingSinServiceId = new Booking({
      userId: user._id,
      date: new Date(),
      time: '15:00',
      guests: 2
    });

    try {
      await bookingSinServiceId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin userId
    const bookingSinUserId = new Booking({
      serviceId: service._id,
      date: new Date(),
      time: '15:00',
      guests: 2
    });

    try {
      await bookingSinUserId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin date
    const bookingSinDate = new Booking({
      serviceId: service._id,
      userId: user._id,
      time: '15:00',
      guests: 2
    });

    try {
      await bookingSinDate.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin time
    const bookingSinTime = new Booking({
      serviceId: service._id,
      userId: user._id,
      date: new Date(),
      guests: 2
    });

    try {
      await bookingSinTime.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin guests
    const bookingSinGuests = new Booking({
      serviceId: service._id,
      userId: user._id,
      date: new Date(),
      time: '15:00'
    });

    try {
      await bookingSinGuests.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería establecer correctamente el estado por defecto y la fecha de creación', async () => {
    // Crear una reserva sin especificar status ni createdAt
    const bookingData = {
      serviceId: service._id,
      userId: user._id,
      date: new Date(),
      time: '14:30',
      guests: 4,
      message: 'Mensaje de prueba para la reserva'
    };

    const beforeSave = new Date();
    const booking = new Booking(bookingData);
    await booking.save();
    const afterSave = new Date();

    const foundBooking = await Booking.findOne({ message: bookingData.message });
    
    // Verificar el estado por defecto
    expect(foundBooking.status).toBe('pending');
    
    // Verificar que la fecha de creación esté entre beforeSave y afterSave
    expect(foundBooking.createdAt).toBeInstanceOf(Date);
    expect(foundBooking.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    expect(foundBooking.createdAt.getTime()).toBeLessThanOrEqual(afterSave.getTime());
  });

  test('debería rechazar una reserva con un ID de usuario o servicio inválido', async () => {
    // Crear una reserva con un ID de usuario inválido
    const bookingWithInvalidUserId = new Booking({
      serviceId: service._id,
      userId: 'invalid-id',
      date: new Date(),
      time: '16:00',
      guests: 3
    });

    try {
      await bookingWithInvalidUserId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Crear una reserva con un ID de servicio inválido
    const bookingWithInvalidServiceId = new Booking({
      serviceId: 'invalid-id',
      userId: user._id,
      date: new Date(),
      time: '16:00',
      guests: 3
    });

    try {
      await bookingWithInvalidServiceId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería rechazar un estado de reserva no válido', async () => {
    // Crear una reserva con un estado no permitido
    const bookingWithInvalidStatus = new Booking({
      serviceId: service._id,
      userId: user._id,
      date: new Date(),
      time: '17:00',
      guests: 2,
      status: 'estado_no_valido'
    });

    try {
      await bookingWithInvalidStatus.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería permitir actualizar el estado de una reserva', async () => {
    // Crear una reserva
    const booking = new Booking({
      serviceId: service._id,
      userId: user._id,
      date: new Date(),
      time: '18:00',
      guests: 5
    });
    
    await booking.save();
    
    // Verificar estado inicial
    expect(booking.status).toBe('pending');
    
    // Actualizar a confirmado
    booking.status = 'confirmed';
    await booking.save();
    
    // Buscar la reserva actualizada
    const updatedBooking = await Booking.findById(booking._id);
    expect(updatedBooking.status).toBe('confirmed');
    
    // Actualizar a cancelado
    updatedBooking.status = 'cancelled';
    await updatedBooking.save();
    
    // Buscar nuevamente
    const cancelledBooking = await Booking.findById(booking._id);
    expect(cancelledBooking.status).toBe('cancelled');
  });

  test('debería poder recuperar múltiples reservas por usuario', async () => {
    // Crear varias reservas para el mismo usuario
    const bookings = [
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-01-15'),
        time: '10:00',
        guests: 2,
        status: 'confirmed'
      },
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-01-20'),
        time: '14:00',
        guests: 3,
        status: 'pending'
      },
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-01-25'),
        time: '19:00',
        guests: 4,
        status: 'cancelled'
      }
    ];

    // Guardar todas las reservas
    for (const bookingData of bookings) {
      const booking = new Booking(bookingData);
      await booking.save();
    }

    // Buscar todas las reservas del usuario
    const userBookings = await Booking.find({ userId: user._id });
    expect(userBookings).toHaveLength(3);

    // Buscar reservas confirmadas
    const confirmedBookings = await Booking.find({ 
      userId: user._id,
      status: 'confirmed'
    });
    expect(confirmedBookings).toHaveLength(1);

    // Buscar reservas canceladas
    const cancelledBookings = await Booking.find({ 
      userId: user._id,
      status: 'cancelled'
    });
    expect(cancelledBookings).toHaveLength(1);
  });

  test('debería poder recuperar reservas por servicio', async () => {
    // Crear un segundo servicio
    const service2 = new Service({
      provider: provider._id,
      name: 'Segundo Servicio Test',
      category: 'Categoría Test',
      description: 'Segundo servicio para pruebas',
      price: 150,
      images: ['test2.jpg'],
      location: 'Ubicación Test 2'
    });
    await service2.save();

    // Crear reservas para distintos servicios
    const bookingsService1 = [
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-02-10'),
        time: '11:00',
        guests: 2
      },
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-02-15'),
        time: '13:00',
        guests: 3
      }
    ];

    const bookingsService2 = [
      {
        serviceId: service2._id,
        userId: user._id,
        date: new Date('2025-02-20'),
        time: '15:00',
        guests: 4
      }
    ];

    // Guardar todas las reservas
    for (const bookingData of [...bookingsService1, ...bookingsService2]) {
      const booking = new Booking(bookingData);
      await booking.save();
    }

    // Buscar reservas del primer servicio
    const service1Bookings = await Booking.find({ serviceId: service._id });
    expect(service1Bookings).toHaveLength(2);

    // Buscar reservas del segundo servicio
    const service2Bookings = await Booking.find({ serviceId: service2._id });
    expect(service2Bookings).toHaveLength(1);
  });

  test('debería poder localizar reservas por rango de fechas', async () => {
    // Crear reservas con fechas específicas
    const bookings = [
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-03-01'),
        time: '10:00',
        guests: 2
      },
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-03-15'),
        time: '14:00',
        guests: 3
      },
      {
        serviceId: service._id,
        userId: user._id,
        date: new Date('2025-03-30'),
        time: '19:00',
        guests: 4
      }
    ];

    // Guardar todas las reservas
    for (const bookingData of bookings) {
      const booking = new Booking(bookingData);
      await booking.save();
    }
    
    // Buscar reservas en un rango de fechas (primera quincena de marzo)
    const firstHalfBookings = await Booking.find({
      date: { 
        $gte: new Date('2025-03-01'),
        $lte: new Date('2025-03-15')
      }
    });
    
    expect(firstHalfBookings).toHaveLength(2);
    
    // Buscar reservas de la segunda quincena de marzo
    const secondHalfBookings = await Booking.find({
      date: { 
        $gt: new Date('2025-03-15'),
        $lte: new Date('2025-03-31')
      }
    });
    
    expect(secondHalfBookings).toHaveLength(1);
  });
});