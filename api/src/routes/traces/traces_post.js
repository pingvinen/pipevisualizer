module.exports = function registerTracesPost(fastify, options, next) {

    const collection = options.db.collection('traces');

    fastify.route({
        method: 'POST',
        url: '/traces',
        schema: {
            body: {
                type: 'object',
                properties: {
                    sender: { type: 'string' },
                    action: { type: 'string', enum: ['received', 'sent'] },
                    path: {
                        type: 'array',
                        items: {
                            type: 'string',
                            minItems: 1
                        }
                    },
                    correlationId: { type: 'string' },
                    payload: { type: 'string' }
                },
                require: [
                    'sender',
                    'action',
                    'path',
                    'correlationId',
                    'payload'
                ]
            },

            response: {
                200: {
                    description: 'OK response - i.e. empty',
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                    }
                },
                500: {
                    description: 'An error occurred',
                    type: 'object',
                    properties: {
                        error: {
                            type: 'object',
                            additionalProperties: true,
                            properties: {
                                message: { type: 'string' },
                                stack: { type: 'string' },
                                name: { type: 'string' }
                            }
                        }
                    }
                }
            }
        },

        handler: (request, reply) => {

            return collection.insertOne(request.body)
                .then((_) => {
                    return '';
                })
                .catch((err) => {
                    reply.code(500);
                    return {error: err};
                });
        }
    });

    next();
};