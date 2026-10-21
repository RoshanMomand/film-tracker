<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class TitleInput
{
    public function __construct(

        // Validating the input data in this class instead of validating in the controller,
        // we can use the DTO to validate the input data before passing it to the controller.

        #[Assert\NotBlank(message: 'Name should not be blank')]
        #[Assert\Length(min: 4, max: 255, minMessage: 'Name should be at least {{ limit }} characters long', maxMessage: 'Name should not exceed {{ limit }} characters')]
        public string $name,

        #[Assert\NotBlank(message: 'Type should not be blank')]
        #[Assert\Length(min: 1, max: 255, minMessage: 'Type should be at least {{ limit }} characters long', maxMessage: 'Type should not exceed {{ limit }} characters')]
        public string $type,

        #[Assert\NotBlank(message: 'Year should not be blank')]
        #[Assert\Positive]
        public int    $year,

        public bool   $watched
    )
    {
    }
}
