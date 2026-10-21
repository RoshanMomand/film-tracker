<?php

namespace App\Controller\Api;

use App\Dto\TitleInput;
use App\Entity\Title;
use App\Repository\TitleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;


// Prefixing the route with /api/titles
#[Route("/api/titles")]
final class TitleController extends AbstractController
{
    #[Route("", name: 'api_title_index', methods: ['GET'])]
    public function index(TitleRepository $titleRepository): JsonResponse
    {
        return $this->json($titleRepository->findAll());
    }

    #[Route("", name: 'api_title_create', methods: ['POST'])]
    public function create(#[MapRequestPayload] TitleInput $input, EntityManagerInterface $entityManager): JsonResponse
    {
        $title = new Title();
        $title->setName($input->name);
        $title->setType($input->type);
        $title->setYear($input->year);
        $title->setWatched($input->watched);


        $entityManager->persist($title);
        $entityManager->flush();

        return $this->json($title, 201);
    }

    #[Route("/{id}", name: 'api_title_update', methods: ['PUT'])]
    public function update(Title $title, #[MapRequestPayload] TitleInput $input, EntityManagerInterface $entityManager): JsonResponse
    {
        $title->setName($input->name);
        $title->setType($input->type);
        $title->setYear($input->year);
        $title->setWatched($input->watched);

        $entityManager->flush();

        return $this->json($title);
    }

    #[Route("/{id}", name: 'api_title_delete', methods: ['DELETE'])]
    public function delete(Title $title, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($title);
        $entityManager->flush();

        return $this->json(null, status: 204);
    }

}
