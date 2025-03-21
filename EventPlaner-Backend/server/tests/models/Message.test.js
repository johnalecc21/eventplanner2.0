import mongoose from 'mongoose';
import Message from '../../models/Message.js';
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
  await Message.deleteMany({});
  await User.deleteMany({});
  await Service.deleteMany({});
  await mongoose.connection.close();
});

// Limpieza antes de cada prueba
beforeEach(async () => {
  await Message.deleteMany({});
  await User.deleteMany({});
  await Service.deleteMany({});
});

describe('Message Model Tests', () => {
  // Creamos datos de referencia para usar en las pruebas
  let user1, user2, service;

  beforeEach(async () => {
    // Crear usuarios para las pruebas
    user1 = new User({
      name: 'Cliente Test',
      email: 'cliente@test.com',
      password: 'password123'
    });
    await user1.save();

    user2 = new User({
      name: 'Proveedor Test',
      email: 'proveedor@test.com',
      password: 'password123'
    });
    await user2.save();

    // Crear un servicio para las pruebas
    service = new Service({
      provider: user2._id,
      name: 'Servicio Test',
      category: 'Categoría Test',
      description: 'Descripción del servicio para pruebas',
      price: 100,
      images: ['test.jpg'],
      location: 'Ubicación Test'
    });
    await service.save();
  });

  test('debería rechazar un mensaje sin campos requeridos', async () => {
    // Sin serviceId
    const messageSinServiceId = new Message({
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Mensaje de prueba'
    });

    try {
      await messageSinServiceId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin senderId
    const messageSinSenderId = new Message({
      serviceId: service._id,
      receiverId: user2._id,
      content: 'Mensaje de prueba'
    });

    try {
      await messageSinSenderId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin receiverId
    const messageSinReceiverId = new Message({
      serviceId: service._id,
      senderId: user1._id,
      content: 'Mensaje de prueba'
    });

    try {
      await messageSinReceiverId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }

    // Sin content
    const messageSinContent = new Message({
      serviceId: service._id,
      senderId: user1._id,
      receiverId: user2._id,
      content: ''
    });

    try {
      await messageSinContent.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería establecer correctamente la fecha de creación por defecto', async () => {
    // Crear un mensaje sin especificar createdAt
    const messageData = {
      serviceId: service._id,
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Mensaje para probar la fecha de creación'
    };

    const beforeSave = new Date();
    const message = new Message(messageData);
    await message.save();
    const afterSave = new Date();

    const foundMessage = await Message.findOne({ content: messageData.content });
    
    // Verificar que la fecha de creación esté entre beforeSave y afterSave
    expect(foundMessage.createdAt).toBeInstanceOf(Date);
    expect(foundMessage.createdAt.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    expect(foundMessage.createdAt.getTime()).toBeLessThanOrEqual(afterSave.getTime());
  });

  test('debería rechazar un mensaje con un ID de usuario inválido', async () => {
    // Crear un mensaje con un ID de usuario inválido
    const messageWithInvalidUserId = new Message({
      serviceId: service._id,
      senderId: 'invalid-id', // ID inválido
      receiverId: user2._id,
      content: 'Mensaje con ID inválido'
    });

    try {
      await messageWithInvalidUserId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería rechazar un mensaje con un ID de servicio inválido', async () => {
    // Crear un mensaje con un ID de servicio inválido
    const messageWithInvalidServiceId = new Message({
      serviceId: 'invalid-id', // ID inválido
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Mensaje con ID de servicio inválido'
    });

    try {
      await messageWithInvalidServiceId.validate();
      fail('Se esperaba que la validación fallara');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('debería poder recuperar múltiples mensajes entre usuarios', async () => {
    // Crear varios mensajes entre los mismos usuarios
    const messages = [
      {
        serviceId: service._id,
        senderId: user1._id,
        receiverId: user2._id,
        content: 'Primer mensaje de prueba'
      },
      {
        serviceId: service._id,
        senderId: user2._id,
        receiverId: user1._id,
        content: 'Respuesta al primer mensaje'
      },
      {
        serviceId: service._id,
        senderId: user1._id,
        receiverId: user2._id,
        content: 'Segundo mensaje de prueba'
      }
    ];

    // Guardar todos los mensajes
    for (const msgData of messages) {
      const msg = new Message(msgData);
      await msg.save();
    }

    // Buscar mensajes donde user1 es el remitente
    const user1Messages = await Message.find({ senderId: user1._id });
    expect(user1Messages).toHaveLength(2);

    // Buscar mensajes donde user2 es el remitente
    const user2Messages = await Message.find({ senderId: user2._id });
    expect(user2Messages).toHaveLength(1);

    // Buscar conversación completa (mensajes relacionados con ambos usuarios)
    const conversation = await Message.find({
      $or: [
        { senderId: user1._id, receiverId: user2._id },
        { senderId: user2._id, receiverId: user1._id }
      ]
    }).sort('createdAt');

    expect(conversation).toHaveLength(3);
    expect(conversation[0].content).toBe('Primer mensaje de prueba');
    expect(conversation[1].content).toBe('Respuesta al primer mensaje');
    expect(conversation[2].content).toBe('Segundo mensaje de prueba');
  });

  test('debería poder localizar mensajes por rango de fechas', async () => {
    // Crear mensajes con fechas específicas
    const now = new Date();
    
    // Mensaje de hace 5 días
    const oldMessage = new Message({
      serviceId: service._id,
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Mensaje antiguo',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    });
    await oldMessage.save();
    
    // Mensaje de hoy
    const recentMessage = new Message({
      serviceId: service._id,
      senderId: user1._id,
      receiverId: user2._id,
      content: 'Mensaje reciente',
      createdAt: now
    });
    await recentMessage.save();
    
    // Buscar mensajes de los últimos 2 días
    const recentMessages = await Message.find({
      createdAt: { 
        $gte: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) 
      }
    });
    
    expect(recentMessages).toHaveLength(1);
    expect(recentMessages[0].content).toBe('Mensaje reciente');
    
    // Buscar todos los mensajes
    const allMessages = await Message.find({});
    expect(allMessages).toHaveLength(2);
  });
});