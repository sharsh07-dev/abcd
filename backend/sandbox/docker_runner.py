"""
backend/sandbox/docker_runner.py
==================================
DockerRunner — Executes commands (pytest, npm, maven) inside an isolated Docker container,
providing a subprocess-like interface.

The container:
- Uses the configured SANDBOX_DOCKER_IMAGE (default: autonomous-healing-sandbox)
- Mounts repo as read-write to /repo
- Has resource limits (memory, CPU)
- Enforces timeout
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Any, Dict, List, Optional
from dataclasses import dataclass

from backend.utils.logger import logger
from config.settings import settings


@dataclass
class DockerResult:
    stdout: str
    stderr: str
    returncode: int


class DockerRunner:
    """
    Isolated Docker-based command runner.
    """

    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path).resolve()
        self._client = None

    @property
    def client(self):
        if self._client is None:
            import docker
            self._client = docker.from_env()
        return self._client

    def run_command(self, cmd: List[str], timeout: int = 120, env: Optional[Dict[str, str]] = None) -> Any:
        """
        Run a command in the Docker container.
        Returns an object with .stdout, .stderr, .returncode (compatible with subprocess.CompletedProcess).
        """
        cmd_str = ' '.join(cmd)
        logger.info(f"[DockerRunner] 🐳 Running: {cmd_str} in {settings.SANDBOX_DOCKER_IMAGE}")
        
        # Ensure we use absolute paths for binding
        repo_bind = str(self.repo_path)
        
        # Prepare environment
        container_env = {"PYTHONHASHSEED": "42", "CI": "true"}
        if env:
            # Convert all env values to string to satisfy Docker SDK
            container_env.update({k: str(v) for k, v in env.items()})

        t0 = time.time()
        container = None
        
        try:
            # We mount the repo as RW so tests can write reports
            container = self.client.containers.run(
                image=settings.SANDBOX_DOCKER_IMAGE,
                command=cmd,
                working_dir="/repo",
                volumes={
                    repo_bind: {"bind": "/repo", "mode": "rw"}
                },
                environment=container_env,
                mem_limit=settings.SANDBOX_MEMORY_LIMIT,
                cpu_quota=settings.SANDBOX_CPU_QUOTA,
                detach=True,  # Run in background to enforce timeout
                # Auto-remove is mostly good, but retrieving logs from a dead container is tricky if it exits fast.
                # We use remove=False and manually remove.
                remove=False, 
            )
            
            # Wait with timeout
            try:
                result = container.wait(timeout=timeout)
                exit_code = result.get('StatusCode', 1)
                
                # Get logs
                logs = container.logs(stdout=True, stderr=True)
                # Docker SDK returns bytes. If tty=False (default), it creates stream.
                # Actually logs() returns bytes.
                output = logs.decode('utf-8', errors='replace')
                
                # return mocked subprocess result
                return DockerResult(
                    stdout=output,
                    stderr="", # Docker mixes them in logs() unless specific options used, typically stdout captures all
                    returncode=exit_code
                )
                
            except Exception as e:
                # Timeout likely
                logger.error(f"[DockerRunner] Container wait error (timeout?): {e}")
                try:
                    container.kill()
                except:
                    pass
                return DockerResult(stdout="", stderr=f"Timeout/Error: {e}", returncode=124) # 124 is standard timeout exit

        except Exception as e:
            logger.error(f"[DockerRunner] Execution failed: {e}")
            return DockerResult(stdout="", stderr=str(e), returncode=255)
            
        finally:
            if container:
                try:
                    container.remove(force=True)
                except:
                    pass
