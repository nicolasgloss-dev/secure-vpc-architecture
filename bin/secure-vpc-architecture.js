#!/usr/bin/env node
"use strict";
/**
 * Project: Secure VPC Network Architecture
 * File: secure-vpc-architecture.ts
 * Author: Nicolas Gloss
 * Description:
 *   Entry point for the CDK application. Synthesises the SecureVpcArchitectureStack.
 *
 * Notes:
 *   - AWS CDK (TypeScript)
 *   - Implements subnet segmentation, NAT Gateway, and Bastion Host
 */
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const secure_vpc_architecture_stack_1 = require("../lib/secure-vpc-architecture-stack");
const app = new cdk.App();
new secure_vpc_architecture_stack_1.SecureVpcArchitectureStack(app, 'SecureVpcArchitectureStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-2',
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjdXJlLXZwYy1hcmNoaXRlY3R1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWN1cmUtdnBjLWFyY2hpdGVjdHVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBOzs7Ozs7Ozs7O0dBVUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCx1Q0FBcUM7QUFDckMsaURBQW1DO0FBQ25DLHdGQUFrRjtBQUVsRixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLDBEQUEwQixDQUFDLEdBQUcsRUFBRSw0QkFBNEIsRUFBRTtJQUNoRSxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7UUFDeEMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksZ0JBQWdCO0tBQzNEO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxyXG4vKipcclxuICogUHJvamVjdDogU2VjdXJlIFZQQyBOZXR3b3JrIEFyY2hpdGVjdHVyZVxyXG4gKiBGaWxlOiBzZWN1cmUtdnBjLWFyY2hpdGVjdHVyZS50c1xyXG4gKiBBdXRob3I6IE5pY29sYXMgR2xvc3NcclxuICogRGVzY3JpcHRpb246XHJcbiAqICAgRW50cnkgcG9pbnQgZm9yIHRoZSBDREsgYXBwbGljYXRpb24uIFN5bnRoZXNpc2VzIHRoZSBTZWN1cmVWcGNBcmNoaXRlY3R1cmVTdGFjay5cclxuICpcclxuICogTm90ZXM6XHJcbiAqICAgLSBBV1MgQ0RLIChUeXBlU2NyaXB0KVxyXG4gKiAgIC0gSW1wbGVtZW50cyBzdWJuZXQgc2VnbWVudGF0aW9uLCBOQVQgR2F0ZXdheSwgYW5kIEJhc3Rpb24gSG9zdFxyXG4gKi9cclxuXHJcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgU2VjdXJlVnBjQXJjaGl0ZWN0dXJlU3RhY2sgfSBmcm9tICcuLi9saWIvc2VjdXJlLXZwYy1hcmNoaXRlY3R1cmUtc3RhY2snO1xyXG5cclxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcclxuXHJcbm5ldyBTZWN1cmVWcGNBcmNoaXRlY3R1cmVTdGFjayhhcHAsICdTZWN1cmVWcGNBcmNoaXRlY3R1cmVTdGFjaycsIHtcclxuICBlbnY6IHtcclxuICAgIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXHJcbiAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiB8fCAnYXAtc291dGhlYXN0LTInLFxyXG4gIH0sXHJcbn0pO1xyXG4iXX0=