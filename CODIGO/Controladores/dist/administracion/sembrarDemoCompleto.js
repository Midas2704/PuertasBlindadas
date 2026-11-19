"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const configuracion_1 = require("./demo/configuracion");
const seguridad_1 = require("./demo/seguridad");
async function ejecutar() {
    const modo = process.argv[2] || 'seed';
    if (modo === 'preview') {
        console.log(JSON.stringify((0, configuracion_1.planDemo)((0, configuracion_1.configuracionDemo)(process.env)), null, 2));
        return;
    }
    if (!['seed', 'status', 'verify', 'clean'].includes(modo))
        throw new Error(`Modo no soportado: ${modo}`);
    if (['seed', 'clean'].includes(modo))
        (0, seguridad_1.validarDestinoDemo)(process.env);
    const { ejecutarDatosDemo, desconectarDemo } = await Promise.resolve().then(() => __importStar(require('./demoCompletoDatos')));
    try {
        await ejecutarDatosDemo(modo);
    }
    finally {
        await desconectarDemo();
    }
}
ejecutar().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
//# sourceMappingURL=sembrarDemoCompleto.js.map