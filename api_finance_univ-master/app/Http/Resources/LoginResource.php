<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user' => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'role' => $this->getRoleNames()->first(),
                'token' => $this->createToken('api_token')->plainTextToken,
            ],
        ];
    }
    
    public function withResponse(Request $request, $response): void
    {
        $response->setData(array_merge([
            'status' => true,
            'message' => 'Login successful',
        ], $response->getData(true)));
    }
}
