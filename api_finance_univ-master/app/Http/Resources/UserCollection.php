<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UserCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'users' => $this->collection->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first(),
                ];
            })->toArray(),
        ];
    }

    public function withResponse(Request $request, $response): void
    {
        $response->setData(array_merge([
            'status' => true,
            'message' => 'Users retrieved successfully',
        ], $response->getData(true)));
    }
}
