import mongoose from 'mongoose';
import Event from '../../models/Event.js';
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
  await Event.deleteMany({});
  await User.deleteMany({});
  await Service.deleteMany({});
  await mongoose.connection.close();
});

// Limpieza antes de cada prueba
beforeEach(async () => {
  await Event.deleteMany({});
  await User.deleteMany({});
  await Service.deleteMany({});
});

describe('Event Model Tests', () => {
  // Creamos datos de referencia para usar en las pruebas
  let organizer, serviceProvider, service;

  beforeEach(async () => {
    // Crear usuarios para las pruebas
    organizer = new User({
      name: 'Organizador Test',
      email: 'organizador@test.com',
      password: 'password123'
    });
    await organizer.save();

    serviceProvider = new User({
      name: 'Proveedor Test',
      email: 'proveedor@test.com',
      password: 'password123'
    });
    await serviceProvider.save();

    // Crear un servicio para las pruebas
    service = new Service({
      provider: serviceProvider._id,
      name: 'Servicio Test',
      category: 'Categoría Test',
      description: 'Descripción del servicio para pruebas',
      price: 100,
      images: ['test.jpg'],
      location: 'Ubicación Test'
    });
    await service.save();
  });

  test('debería rechazar un evento sin campos requeridos', async () => {
    // Sin organizer
    const eventSinOrganizer = new Event({
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });

    try {
      await eventSinOrganizer.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin title
    const eventSinTitle = new Event({
      organizer: organizer._id,
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });

    try {
      await eventSinTitle.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin description
    const eventSinDescription = new Event({
      organizer: organizer._id,
      title: 'Evento de Prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });

    try {
      await eventSinDescription.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin date
    const eventSinDate = new Event({
      organizer: organizer._id,
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });

    try {
      await eventSinDate.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin location
    const eventSinLocation = new Event({
      organizer: organizer._id,
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      category: 'Categoría del Evento'
    });

    try {
      await eventSinLocation.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin category
    const eventSinCategory = new Event({
      organizer: organizer._id,
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento'
    });

    try {
      await eventSinCategory.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería establecer correctamente los valores por defecto', async () => {
    // Crear un evento con los campos mínimos requeridos
    const eventData = {
      organizer: organizer._id,
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    };

    const beforeSave = new Date();
    const event = new Event(eventData);
    await event.save();
    const afterSave = new Date();

    const foundEvent = await Event.findOne({ title: eventData.title });
    
    // Verificar el estado por defecto
    expect(foundEvent.status).toBe('draft');
    
    // Verificar notificationsSent por defecto
    expect(foundEvent.notificationsSent).toBe(false);
    
    // Verificar estimatedTotalCost por defecto
    expect(foundEvent.estimatedTotalCost).toBe(0);
    
    // Verificar que createdAt esté entre beforeSave y afterSave
    expect(foundEvent.createdAt).toBeInstanceOf(Date);
    expect(foundEvent.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    expect(foundEvent.createdAt.getTime()).toBeLessThanOrEqual(afterSave.getTime());
    
    // Verificar que updatedAt esté entre beforeSave y afterSave
    expect(foundEvent.updatedAt).toBeInstanceOf(Date);
    expect(foundEvent.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    expect(foundEvent.updatedAt.getTime()).toBeLessThanOrEqual(afterSave.getTime());
  });

  test('debería actualizar updatedAt al modificar el evento', async () => {
    // Crear un evento
    const event = new Event({
      organizer: organizer._id,
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });
    
    await event.save();
    const createdAt = event.createdAt;
    const originalUpdatedAt = event.updatedAt;
    
    // Esperar un momento para asegurar que la diferencia de tiempo sea detectable
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Modificar el evento
    event.title = 'Título Actualizado';
    await event.save();
    
    // Buscar el evento actualizado
    const updatedEvent = await Event.findById(event._id);
    
    // Verificar que createdAt no cambia
    expect(updatedEvent.createdAt.getTime()).toBe(createdAt.getTime());
    
    // Verificar que updatedAt ha cambiado
    expect(updatedEvent.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  test('debería rechazar un evento con un ID de organizador inválido', async () => {
    // Crear un evento con un ID de organizador inválido
    const eventWithInvalidOrganizerId = new Event({
      organizer: 'invalid-id',
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });

    try {
      await eventWithInvalidOrganizerId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería rechazar un estado de evento no válido', async () => {
    // Crear un evento con un estado no permitido
    const eventWithInvalidStatus = new Event({
      organizer: organizer._id,
      title: 'Evento de Prueba',
      description: 'Descripción del evento de prueba',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      status: 'estado_no_valido'
    });

    try {
      await eventWithInvalidStatus.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería validar correctamente el array de servicios', async () => {
    // Crear un evento con servicios válidos
    const eventWithValidServices = new Event({
      organizer: organizer._id,
      title: 'Evento con Servicios',
      description: 'Descripción del evento con servicios',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      services: [
        {
          service: service._id,
          status: 'pending',
          price: 100
        },
        {
          service: service._id,
          status: 'confirmed',
          price: 150
        }
      ]
    });
    
    // Debería validar sin errores
    await eventWithValidServices.validate();
    
    // Crear un evento con un estado de servicio no válido
    const eventWithInvalidServiceStatus = new Event({
      organizer: organizer._id,
      title: 'Evento con Servicios Inválidos',
      description: 'Descripción del evento con servicios inválidos',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      services: [
        {
          service: service._id,
          status: 'estado_no_valido',
          price: 100
        }
      ]
    });
    
    try {
      await eventWithInvalidServiceStatus.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería validar correctamente el array de invitados', async () => {
    // Crear un evento con invitados válidos
    const eventWithValidGuests = new Event({
      organizer: organizer._id,
      title: 'Evento con Invitados',
      description: 'Descripción del evento con invitados',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      guests: [
        {
          name: 'Invitado 1',
          email: 'invitado1@test.com',
          status: 'invited'
        },
        {
          name: 'Invitado 2',
          email: 'invitado2@test.com',
          status: 'confirmed'
        }
      ]
    });
    
    // Debería validar sin errores
    await eventWithValidGuests.validate();
    
    // Crear un evento con un invitado sin nombre
    const eventWithInvalidGuest = new Event({
      organizer: organizer._id,
      title: 'Evento con Invitados Inválidos',
      description: 'Descripción del evento con invitados inválidos',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      guests: [
        {
          email: 'invitadosinnombre@test.com',
          status: 'invited'
        }
      ]
    });
    
    try {
      await eventWithInvalidGuest.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
    
    // Crear un evento con un invitado con estado no válido
    const eventWithInvalidGuestStatus = new Event({
      organizer: organizer._id,
      title: 'Evento con Estado de Invitado Inválido',
      description: 'Descripción del evento con estado de invitado inválido',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      guests: [
        {
          name: 'Invitado Test',
          email: 'invitado@test.com',
          status: 'estado_no_valido'
        }
      ]
    });
    
    try {
      await eventWithInvalidGuestStatus.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  
  test('debería poder actualizar el estado de un evento', async () => {
    // Crear un evento
    const event = new Event({
      organizer: organizer._id,
      title: 'Evento para Actualizar Estado',
      description: 'Descripción del evento para actualizar estado',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento'
    });
    
    await event.save();
    
    // Verificar estado inicial
    expect(event.status).toBe('draft');
    
    // Actualizar a publicado
    event.status = 'published';
    await event.save();
    
    // Buscar el evento actualizado
    const publishedEvent = await Event.findById(event._id);
    expect(publishedEvent.status).toBe('published');
    
    // Actualizar a cancelado
    publishedEvent.status = 'cancelled';
    await publishedEvent.save();
    
    // Buscar nuevamente
    const cancelledEvent = await Event.findById(event._id);
    expect(cancelledEvent.status).toBe('cancelled');
    
    // Actualizar a completado
    cancelledEvent.status = 'completed';
    await cancelledEvent.save();
    
    // Buscar nuevamente
    const completedEvent = await Event.findById(event._id);
    expect(completedEvent.status).toBe('completed');
  });

  test('debería poder calcular el costo total estimado basado en los servicios', async () => {
    // Crear un evento con servicios
    const event = new Event({
      organizer: organizer._id,
      title: 'Evento con Costo Estimado',
      description: 'Descripción del evento con costo estimado',
      date: new Date('2025-06-15'),
      location: 'Ubicación del Evento',
      category: 'Categoría del Evento',
      services: [
        {
          service: service._id,
          status: 'confirmed',
          price: 1000
        },
        {
          service: service._id,
          status: 'confirmed',
          price: 1500
        },
        {
          service: service._id,
          status: 'pending',
          price: 2000
        }
      ]
    });
    
    await event.save();
    
    // Actualizar el costo estimado
    event.estimatedTotalCost = event.services.reduce((total, service) => total + service.price, 0);
    await event.save();
    
    // Verificar el costo estimado
    const updatedEvent = await Event.findById(event._id);
    expect(updatedEvent.estimatedTotalCost).toBe(4500);
  });

  test('debería poder recuperar eventos por organizador', async () => {
    // Crear un segundo organizador
    const secondOrganizer = new User({
      name: 'Segundo Organizador',
      email: 'segundo.organizador@test.com',
      password: 'password123'
    });
    await secondOrganizer.save();
    
    // Crear eventos para distintos organizadores
    const eventsOrganizer1 = [
      {
        organizer: organizer._id,
        title: 'Evento 1 del Organizador 1',
        description: 'Descripción del evento 1',
        date: new Date('2025-07-10'),
        location: 'Ubicación 1',
        category: 'Categoría 1'
      },
      {
        organizer: organizer._id,
        title: 'Evento 2 del Organizador 1',
        description: 'Descripción del evento 2',
        date: new Date('2025-07-15'),
        location: 'Ubicación 2',
        category: 'Categoría 1'
      }
    ];

    const eventsOrganizer2 = [
      {
        organizer: secondOrganizer._id,
        title: 'Evento 1 del Organizador 2',
        description: 'Descripción del evento 1',
        date: new Date('2025-07-20'),
        location: 'Ubicación 3',
        category: 'Categoría 2'
      }
    ];

    // Guardar todos los eventos
    for (const eventData of [...eventsOrganizer1, ...eventsOrganizer2]) {
      const event = new Event(eventData);
      await event.save();
    }

    // Buscar eventos del primer organizador
    const organizer1Events = await Event.find({ organizer: organizer._id });
    expect(organizer1Events).toHaveLength(2);

    // Buscar eventos del segundo organizador
    const organizer2Events = await Event.find({ organizer: secondOrganizer._id });
    expect(organizer2Events).toHaveLength(1);
  });

  test('debería poder localizar eventos por rango de fechas', async () => {
    // Crear eventos con fechas específicas
    const events = [
      {
        organizer: organizer._id,
        title: 'Evento de Enero',
        description: 'Descripción del evento de enero',
        date: new Date('2025-01-15'),
        location: 'Ubicación Enero',
        category: 'Categoría Test'
      },
      {
        organizer: organizer._id,
        title: 'Evento de Febrero',
        description: 'Descripción del evento de febrero',
        date: new Date('2025-02-15'),
        location: 'Ubicación Febrero',
        category: 'Categoría Test'
      },
      {
        organizer: organizer._id,
        title: 'Evento de Marzo',
        description: 'Descripción del evento de marzo',
        date: new Date('2025-03-15'),
        location: 'Ubicación Marzo',
        category: 'Categoría Test'
      }
    ];

    // Guardar todos los eventos
    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
    }
    
    // Buscar eventos del primer trimestre
    const firstQuarterEvents = await Event.find({
      date: { 
        $gte: new Date('2025-01-01'),
        $lte: new Date('2025-03-31')
      }
    }).sort('date');
    
    expect(firstQuarterEvents).toHaveLength(3);
    expect(firstQuarterEvents[0].title).toBe('Evento de Enero');
    expect(firstQuarterEvents[1].title).toBe('Evento de Febrero');
    expect(firstQuarterEvents[2].title).toBe('Evento de Marzo');
    
    // Buscar eventos de febrero
    const februaryEvents = await Event.find({
      date: { 
        $gte: new Date('2025-02-01'),
        $lte: new Date('2025-02-28')
      }
    });
    
    expect(februaryEvents).toHaveLength(1);
    expect(februaryEvents[0].title).toBe('Evento de Febrero');
  });

  test('debería poder filtrar eventos por categoría', async () => {
    // Crear eventos con diferentes categorías
    const events = [
      {
        organizer: organizer._id,
        title: 'Evento de Boda',
        description: 'Descripción de la boda',
        date: new Date('2025-05-15'),
        location: 'Ubicación Boda',
        category: 'Boda'
      },
      {
        organizer: organizer._id,
        title: 'Evento Corporativo 1',
        description: 'Descripción del evento corporativo 1',
        date: new Date('2025-05-20'),
        location: 'Ubicación Corporativa 1',
        category: 'Corporativo'
      },
      {
        organizer: organizer._id,
        title: 'Evento Corporativo 2',
        description: 'Descripción del evento corporativo 2',
        date: new Date('2025-05-25'),
        location: 'Ubicación Corporativa 2',
        category: 'Corporativo'
      }
    ];

    // Guardar todos los eventos
    for (const eventData of events) {
      const event = new Event(eventData);
      await event.save();
    }
    
    // Buscar eventos de bodas
    const weddingEvents = await Event.find({ category: 'Boda' });
    expect(weddingEvents).toHaveLength(1);
    expect(weddingEvents[0].title).toBe('Evento de Boda');
    
    // Buscar eventos corporativos
    const corporateEvents = await Event.find({ category: 'Corporativo' });
    expect(corporateEvents).toHaveLength(2);
  });
});