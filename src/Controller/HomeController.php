<?php

namespace App\Controller;

use App\Entity\Title;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/titles/{id}/edit', name: 'app_title_edit', methods: ['GET'])]
    public function edit(Title $title): Response
    {
        return $this->render('home/edit.html.twig', [
            'title' => $title,
        ]);
    }
}
